from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from sqlalchemy import select, update, func
from schemas.subcategory import SubcategoryCreateSchema, SubcategoryUpdateSchema, SubcategoryResponse
from models import Subcategory, SubcategoryQuestion, Question, Category
from cruds import question_crud as question_cruds
from typing import Optional
from src.repository.category_repository import CategoryRepository
from src.repository.subcategory_repository import SubcategoryRepository, SubcategoryCreate, SubcategoryUpdate
from src.repository.subcategory_question_repository import SubcategoryQuestionRepository
from src.repository.question_repository import QuestionRepository


# カテゴリbox内で表示するサブカテゴリを取得
async def find_subcategories_in_categorybox(
    db: AsyncSession, 
    category_id: int, 
    limit: int, 
    searchSubcategoryWord: str, 
    searchQuestionWord: str, 
    searchAnswerWord: str
) -> list[SubcategoryResponse]:
    subcategory_repository = SubcategoryRepository(db)
    question_repository = QuestionRepository(db)
    subcategory_question_repository = SubcategoryQuestionRepository(db)
    if searchSubcategoryWord:
        results = subcategory_repository.find_by_name_starts_with(searchSubcategoryWord)


    elif searchQuestionWord and len(searchQuestionWord) >= 3:
        # query2 = select(Question.id).where(Question.problem.istartswith(searchQuestionWord))
        # question_ids = db.execute(query2).scalars().all()

        question_repository = QuestionRepository(db)
        questions = await question_repository.find_ids_by_problem_starts_with(searchQuestionWord)
        question_ids = [question.id for question in questions]

        # query3 = select(SubcategoryQuestion.subcategory_id).where(SubcategoryQuestion.question_id.in_(question_ids))
        # subcategory_ids = db.execute(query3).scalars().all()
        subcategory_question_repository = SubcategoryQuestionRepository(db)
        subcategory_ids = []
        for question_id in question_ids:
            subcategory_questions = await subcategory_question_repository.find_by_question_ids(question_id)
            subcategory_ids.extend([sq.subcategory_id for sq in subcategory_questions])

        query = select(Subcategory).where(Subcategory.category_id == category_id).where(Subcategory.id.in_(subcategory_ids))

    elif searchAnswerWord and len(searchAnswerWord) >= 3:
        query2 = select(Question.id).where(
            func.array_to_string(Question.answer, ',').ilike(f"%{searchAnswerWord}%")
        )
        question_ids = db.execute(query2).scalars().all()
        
        query3 = select(SubcategoryQuestion.subcategory_id).where(SubcategoryQuestion.question_id.in_(question_ids))
        subcategory_ids = db.execute(query3).scalars().all()
        
        query = select(Subcategory).where(Subcategory.category_id == category_id).where(Subcategory.id.in_(subcategory_ids))
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
    db: AsyncSession, 
    id: int
) -> Optional[SubcategoryResponse]:

    subcategory_repository = SubcategoryRepository(db)
    return await subcategory_repository.get(id)


# リポジトリパターンに置換しない
# async def find_subcategories_with_category_name_by_category_id(
#     db: Session, 
#     category_id: int
# ) -> list[SubcategoryResponse]:

#     # subcategory_repository = SubcategoryRepository(db)
    
#     # category_repository = CategoryRepository(db)
#     # category = await category_repository.get(category_id)

#     # subcategories = await subcategory_repository.find_by_category_id(category_id)

#     query1 = (
#         select(Subcategory.id, Subcategory.name, Subcategory.category_id, Category.name.label("category_name")).
#         join(Category, Subcategory.category_id == Category.id).
#         where(Subcategory.category_id == category_id)
#     )
    
#     return db.execute(query1).fetchall()

# リポジトリパターンに置換しない
async def find_subcategories_with_category_name_by_question_id(
    db: Session, 
    question_id: int
) -> list[SubcategoryResponse]:
    query1 = select(Subcategory.id, Subcategory.name, Subcategory.category_id, Category.name.label("category_name")).join(SubcategoryQuestion, Subcategory.id == SubcategoryQuestion.subcategory_id).join(Category, Subcategory.category_id == Category.id).where(SubcategoryQuestion.question_id == question_id)
    return db.execute(query1).fetchall()

# リポジトリパターンに置換済み
async def find_subcategory_by_name(
    db: AsyncSession, 
    name: str
) -> list[SubcategoryResponse]:
    
    subcategory_repository = SubcategoryRepository(db)
    return await subcategory_repository.find_by_name_contains(name)

# リポジトリパターンに置換しない
# async def find_subcategories_with_category_name_by_id(
#     db: Session, 
#     id: int
# ):
#     query = (
#         select(Subcategory.id, Subcategory.name, Subcategory.category_id, Category.name.label("category_name"))
#         .join(Category, Subcategory.category_id == Category.id)
#         .where(Subcategory.id == id)
#     )
#     return db.execute(query).fetchone()

# リポジトリパターンに置換済み
async def find_subcategories_by_category_id(
    db: AsyncSession,
    category_id: int
) -> list[SubcategoryResponse]:
    
    subcategory_repository = SubcategoryRepository(db)
    return await subcategory_repository.find_by_category_id(category_id)

# リポジトリパターンに置換済み
async def create_subcategory(
    db: AsyncSession,
    subcategory_create: SubcategoryCreateSchema
) -> SubcategoryResponse:

    subcategory_repository = SubcategoryRepository(db)

    return await subcategory_repository.create(SubcategoryCreate(name=subcategory_create.name, category_id=subcategory_create.category_id))
    

async def delete_subcategory(
    db: AsyncSession, 
    id: int
) -> Optional[SubcategoryResponse]:
    subcategory = await find_subcategory_by_id(db, id)
    if subcategory is None:
        return None
    
    subcategory_repository = SubcategoryRepository(db)
    
    questions = question_cruds.find_all_questions_in_subcategory(db, id)
    
    for question in questions:
        question_cruds.delete_question(db, question.id)
    
    return await subcategory_repository.delete(id)
