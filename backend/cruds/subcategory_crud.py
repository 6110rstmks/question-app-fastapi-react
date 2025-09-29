from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import select, func
from schemas.subcategory import SubcategoryResponse
from models import Subcategory, SubcategoryQuestion, Question
from cruds import question_crud as question_cruds
from typing import Optional
from src.repository.subcategory_repository import SubcategoryRepository, SubcategoryCreate, SubcategoryRead
from src.repository.subcategory_question_repository import SubcategoryQuestionRepository
from src.repository.question_repository import QuestionRepository
from database import SessionDependency


# カテゴリbox内で表示するサブカテゴリを取得
async def find_subcategories_in_categorybox(
    db: AsyncSession, 
    category_id: int, 
    limit: int, 
    searchSubcategoryWord: str, 
    searchQuestionWord: str, 
    searchAnswerWord: str
) -> list[SubcategoryRead]:
    subcategory_repository = SubcategoryRepository(db)
    question_repository = QuestionRepository(db)
    subcategory_question_repository = SubcategoryQuestionRepository(db)
    subcategory_question_repository = SubcategoryQuestionRepository(db)


    if searchSubcategoryWord:
        result = subcategory_repository.find_by_name_starts_with(searchSubcategoryWord)
        print(result)

    elif searchQuestionWord and len(searchQuestionWord) >= 3:

        questions = await question_repository.find_by_problem_contains(searchQuestionWord)
        question_ids = [question.id for question in questions]

        # query3 = select(SubcategoryQuestion.subcategory_id).where(SubcategoryQuestion.question_id.in_(question_ids))
        # subcategory_ids = db.execute(query3).scalars().all()
        subcategory_ids = []
        for question_id in question_ids:
            subcategory_questions = await subcategory_question_repository.find_by_question_ids(question_id)
            subcategory_ids.extend([sq.subcategory_id for sq in subcategory_questions])

        result = await subcategory_repository.find_by_category_id_and_ids(category_id, subcategory_ids)

    elif searchAnswerWord and len(searchAnswerWord) >= 3:
        query2 = select(Question.id).where(
            func.array_to_string(Question.answer, ',').ilike(f"%{searchAnswerWord}%")
        )
        question_ids = db.execute(query2).scalars().all()
        
        query3 = select(SubcategoryQuestion.subcategory_id).where(SubcategoryQuestion.question_id.in_(question_ids))
        subcategory_ids = db.execute(query3).scalars().all()
        
        query = select(Subcategory).where(Subcategory.category_id == category_id).where(Subcategory.id.in_(subcategory_ids))
        print('それどうな')
    else:
        # query = select(Subcategory).where(Subcategory.category_id == category_id)
        result = await subcategory_repository.find_by_category_id(category_id)

    # result = db.execute(query).scalars().all()
    # サブカテゴリに紐づくQuestion数を取得してSubcategoryモデルに付加
    for subcategory in result:
        subcategories_questions = await subcategory_question_repository.find_by_subcategory_id(subcategory.id)
        subcategory.question_count = len(subcategories_questions)

    if limit is None:  # limitが指定されていない場合
        return result
    # 6件(limit)まで表示
    return result[0: 0 + limit]


# リポジトリパターンに置換済み
async def find_subcategory_by_id(
    id: int,
    session=SessionDependency
) -> Optional[SubcategoryResponse]:

    subcategory_repository = SubcategoryRepository(session)
    return await subcategory_repository.get(id)


# リポジトリパターンに置換済み
async def find_subcategories_by_category_id(
    category_id: int,
    searchSubcategoryName: Optional[str] = None,
    session=SessionDependency
) -> list[SubcategoryRead]:

    subcategory_repository = SubcategoryRepository(session)

    if searchSubcategoryName:
        return await subcategory_repository.find_by_category_id_and_name_like(category_id, f"%{searchSubcategoryName}%")    
    return await subcategory_repository.find_by_category_id(category_id)

    
# リポジトリパターンに置換済み
async def delete_subcategory(
    id: int,
    session=SessionDependency
) -> Optional[SubcategoryRead]:
    subcategory_repository = SubcategoryRepository(session)

    questions = await question_cruds.find_all_questions_in_subcategory(id, session)
    
    for question in questions:
        await question_cruds.delete_question(question.id, session)

    return await subcategory_repository.delete(id)
