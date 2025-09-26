from sqlalchemy.orm import Session
from sqlalchemy import select, func
from schemas.category import CategoryCreateSchema
from models import Category, CategoryQuestion, Subcategory, Question
from config import PAGE_SIZE
from fastapi import HTTPException
from typing import Optional
from src.repository.category_repository import CategoryRepository, CategoryCreate
from database import SessionDependency


# リポジトリパターンに置換済み
async def find_all_categories(session=SessionDependency)-> list[Category]:
    category_repository = CategoryRepository(session)
    return await category_repository.get_all()

# リポジトリパターンにこれから移管
def find_all(
    db: Session, 
    limit: int, 
    skip: int = 0,  
    category_word: str = None, 
    subcategory_word: str = None, 
    question_word: str = None, 
    answer_word: str = None
) -> list[Category]:

    # カテゴリテーブルがそんざいするかどうかの確認。
    # テーブルの存在確認を行う理由はデフォルトでは。
    if not db.query(Category).first():
        return None  
    
    query_stmt = select(Category)
    
    # Category欄で検索した場合
    if category_word:
        query_stmt = (
            query_stmt
            .where(Category.name.istartswith(f"%{category_word}%"))
        )

    # Subcategory欄で検索した場合
    # 検索した名前のサブカテゴリを持つCategoriesを返す。
    if subcategory_word:
        query2 = select(Subcategory.category_id).where(Subcategory.name.istartswith(f"%{subcategory_word}%"))
        category_ids = db.execute(query2).scalars().all()
        query_stmt = query_stmt.where(Category.id.in_(category_ids))

    
    # Question欄で検索した場合
    # そのQuestionを持つSubcategoryを取得するしてCategoriesで返す。
    if question_word:
        # query3 = select(Subcategory.category_id).where(Subcategory.questions.any(SubcategoryQuestion.question.has(SubcategoryQuestion.question.problem.istartswith(f"%{question_word}%"))))
        # category_ids = db.execute(query3).scalars().all()
        
        query2 = select(Question.id).where(Question.problem.istartswith(f"%{question_word}%"))
        question_ids = db.execute(query2).scalars().all()
        
        
        query3 = (
            select(CategoryQuestion.category_id)
            .where(CategoryQuestion.question_id.in_(question_ids))
        )
        category_ids = db.execute(query3).scalars().all()
        
        query_stmt = query_stmt.where(Category.id.in_(category_ids))  
    
    if answer_word:
        query2 = select(Question.id).where(
            func.array_to_string(Question.answer, ',').ilike(f"%{answer_word}%")
        )
        question_ids = db.execute(query2).scalars().all()
        query3 = select(CategoryQuestion.category_id).where(CategoryQuestion.question_id.in_(question_ids))
        category_ids = db.execute(query3).scalars().all()      
        query_stmt = query_stmt.where(Category.id.in_(category_ids))

    # 結果を取得してスキップとリミットを適用
    result = db.execute(query_stmt).scalars().all()
    return result[skip: skip + limit]

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
