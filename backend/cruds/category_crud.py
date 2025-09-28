from sqlalchemy import select, func
from schemas.category import CategoryCreateSchema
from models import Category, CategoryQuestion, Question
from config import PAGE_SIZE
from fastapi import HTTPException
from typing import Optional

from src.repository.category_repository import CategoryRepository, CategoryCreate
from src.repository.subcategory_repository import SubcategoryRepository
from src.repository.question_repository import QuestionRepository
from src.repository.category_question_repository import CategoryQuestionRepository


from database import SessionDependency


# リポジトリパターンに置換済み
async def find_all_categories(session=SessionDependency)-> list[Category]:
    category_repository = CategoryRepository(session)
    return await category_repository.get_all()

# リポジトリパターンにこれから移管
# まずはapiテストコードを書いてから移管する。
async def find_all(
    limit: int, 
    skip: int = 0,  
    category_word: str = None, 
    subcategory_word: str = None, 
    question_word: str = None, 
    answer_word: str = None,
    session=SessionDependency
) -> list[Category]:

    # カテゴリテーブルがそんざいするかどうかの確認。
    # テーブルの存在確認を行う理由はデフォルトでは。

    category_repository = CategoryRepository(session)
    subcategory_repository = SubcategoryRepository(session)
    question_repository = QuestionRepository(session)
    category_question_repository = CategoryQuestionRepository(session)

    data = []
    if not await category_repository.get_all():
        return None  
    
    
    # Category欄で検索した場合
    if category_word:

        data = await category_repository.find_by_name_contains(category_word)
        print('たんま')
        print(data)
        print('えなう')

    # Subcategory欄で検索した場合
    # 検索した名前のサブカテゴリを持つCategoriesを返す。
    elif subcategory_word:
        # query2 = select(Subcategory.category_id).where(Subcategory.name.istartswith(f"%{subcategory_word}%"))
        subcategory_data = await subcategory_repository.find_by_name_contains(subcategory_word)
        category_ids = [item.category_id for item in subcategory_data]

        data = await category_repository.find_by_ids(category_ids)

    
    # Question欄で検索した場合
    # そのQuestionを持つSubcategoryを取得するしてCategoriesで返す。
    elif question_word:
        
        question_data = await question_repository.find_by_problem_contains(question_word)
        question_ids = [item.id for item in question_data]
        categories_questions = await category_question_repository.find_by_question_ids(question_ids)
        category_ids = [item.category_id for item in categories_questions]
        data = await category_repository.find_by_ids(category_ids)

    elif answer_word:
        question_data = await question_repository.find_by_answer_contains(answer_word)
        question_ids = [item.id for item in question_data]
        category_ids = await category_question_repository.find_by_question_ids(question_ids)
        category_ids = [item.category_id for item in category_ids]
        data = await category_repository.find_by_ids(category_ids)

    else:
        data = await category_repository.get_all()
    # 結果を取得してスキップとリミットを適用
    # result = db.execute(query_stmt).scalars().all()
    print(data)
    print('うあさ')
    return data[skip: skip + limit]

# リポジトリパターンに置換済み
async def find_category_by_id(
    id: int,
    session=SessionDependency
) -> Optional["Category"]:
    category_repository = CategoryRepository(session)
    return await category_repository.get(id)

# リポジトリパターンに置換済み
# あいまい検索
async def find_category_by_name(
    search_word: str,
    session=SessionDependency
) -> list[Category]:
    category_repository = CategoryRepository(session)
    return await category_repository.find_by_name_contains(search_word)


# リポジトリパターンに置換済み
async def create_category(
    category_create: CategoryCreateSchema,
    session=SessionDependency
) -> Category:
    category_repository = CategoryRepository(session)
    check_bool =  await category_repository.check_name_exists(category_create.name)

    if check_bool:
        raise HTTPException(status_code=400, detail="Category already exists.")

    return await category_repository.create(CategoryCreate(name=category_create.name, user_id=1))

# リポジトリパターンに置換済み
# ページネーション
async def get_page_count(session=SessionDependency) -> int:
    category_repository = CategoryRepository(session)

    count_page = await category_repository.count_all()
    count_page = count_page // PAGE_SIZE + 1
    return count_page

# 現在未使用
# Questionを一つでも持つCategoryをすべて取得する。
# SetProblem画面にて、Categoryを選択する際に使用する。
# def find_all_categories_with_questions(db: Session) -> list[Category]:
#     query1 = select(CategoryQuestion.category_id).distinct()
#     category_ids = db.execute(query1).scalars().all()
    
#     query2 = select(Category).where(Category.id.in_(category_ids))
#     result = db.execute(query2).scalars().all()

#     for category in result:
#         category.question_count = len(category.questions)

#         category.incorrected_answered_question_count = 0
        
#         for categoryquestion in category.questions:
#             if categoryquestion.question.is_correct == 'Incorrect':
#                 category.incorrected_answered_question_count += 1
                    
#     return result

# 現在未使用
# async def find_category_by_question_id(
#     db: AsyncSession, 
#     question_id: int
# ) -> Optional["Category"]:
#     category_question_repository = CategoryQuestionRepository(db)
#     category_question = await category_question_repository.find_by_question_id(question_id)
#     if not category_question:
#         return None
#     category_repository = CategoryRepository(db)
#     return await category_repository.get(category_question.category_id)
