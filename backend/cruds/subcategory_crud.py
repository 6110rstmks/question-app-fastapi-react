from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func
from backend.schemas.subcategory import SubcategoryCreate, SubcategoryUpdate, SubcategoryResponse
from backend.models import Subcategory, SubcategoryQuestion, Question, Category
from backend.cruds import question_crud as question_cruds
from fastapi import HTTPException
from typing import Optional
from backend.src.repository.subcategory_repository import SubcategoryRepository


# カテゴリbox内で表示するサブカテゴリを取得
def find_subcategories_in_categorybox(
    db: AsyncSession, 
    category_id: int, 
    limit: int, 
    searchSubcategoryWord: str, 
    searchQuestionWord: str, 
    searchAnswerWord: str
) -> list[SubcategoryResponse]:
    if searchSubcategoryWord:
        query = select(Subcategory).where(Subcategory.category_id == category_id).where(Subcategory.name.istartswith(f"%{searchSubcategoryWord}%"))

    elif searchQuestionWord and len(searchQuestionWord) >= 3:
        query2 = select(Question.id).where(Question.problem.istartswith(f"%{searchQuestionWord}%"))
        question_ids = db.execute(query2).scalars().all()
             
        query3 = select(SubcategoryQuestion.subcategory_id).where(SubcategoryQuestion.question_id.in_(question_ids))
        subcategory_ids = db.execute(query3).scalars().all()        
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
        query = select(Subcategory).where(Subcategory.category_id == category_id)

    result = db.execute(query).scalars().all()

    # サブカテゴリに紐づくQuestion数を取得してSubcategoryモデルに付加
    for subcategory in result:
        subcategory.question_count = len(subcategory.questions)
    
    if limit is None:  # limitが指定されていない場合
        return result
    # 6件(limit)まで表示
    return result[0: 0 + limit]


def find_subcategory_by_id(
    db: AsyncSession, 
    id: int
) -> Optional[SubcategoryResponse]:
    query = select(Subcategory).where(Subcategory.id == id)
    return db.execute(query).scalars().first()


def find_subcategories_by_question_id(
    db: AsyncSession, 
    question_id: int
) -> list[SubcategoryResponse]:
    # query = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id == question_id)
    query = select(SubcategoryQuestion.subcategory_id).where(SubcategoryQuestion.question_id == question_id)
    # results = db.execute(query).scalars().all()
    subcategory_ids = db.execute(query).scalars().all()
    
    # subcategory_ids = []
    # for result in results:
    #     subcategory_ids.append(result.subcategory_id)
        
    query2 = select(Subcategory).where(Subcategory.id.in_(subcategory_ids))
        
    return db.execute(query2).scalars().all()


def find_subcategories_with_category_name_by_category_id(
    db: AsyncSession, 
    category_id: int
) -> list[SubcategoryResponse]:

    query1 = select(Subcategory.id, Subcategory.name, Subcategory.category_id, Category.name.label("category_name")).join(Category, Subcategory.category_id == Category.id).where(Subcategory.category_id == category_id)

    return db.execute(query1).fetchall()


def find_subcategories_with_category_name_by_question_id(
    db: AsyncSession, 
    question_id: int
) -> list[SubcategoryResponse]:
    query1 = select(Subcategory.id, Subcategory.name, Subcategory.category_id, Category.name.label("category_name")).join(SubcategoryQuestion, Subcategory.id == SubcategoryQuestion.subcategory_id).join(Category, Subcategory.category_id == Category.id).where(SubcategoryQuestion.question_id == question_id)
    return db.execute(query1).fetchall()


def find_subcategory_by_name(
    db: AsyncSession, 
    name: str
) -> list[SubcategoryResponse]:
    return (
        db.query(Subcategory)
        .filter(Subcategory.name.like(f"%{name}%"))
        .all()
    )
    

def find_subcategories_with_category_name_by_id(
    db: AsyncSession, 
    id: int
):
    query = (
        select(Subcategory.id, Subcategory.name, Subcategory.category_id, Category.name.label("category_name"))
        .join(Category, Subcategory.category_id == Category.id)
        .where(Subcategory.id == id)
    )
    return db.execute(query).fetchone()


def create_subcategory(
    db: AsyncSession,
    subcategory_create: SubcategoryCreate
) -> SubcategoryResponse:

    subcategory_repository = SubcategoryRepository(db)

    existing_subcategory = (
        db.query(Subcategory)
        .filter(Subcategory.name == subcategory_create.name)
        .first()
    )
        
    # if文を入れ子にしている理由はexisting_subcategoryがNoneの場合にエラーが発生するため
    if existing_subcategory:
        if existing_subcategory.category_id == subcategory_create.category_id:
            raise HTTPException(status_code=400, detail="Subcategory already exists")

    new_subcategory = Subcategory(**subcategory_create.model_dump())
    db.add(new_subcategory)
    db.commit()
    return new_subcategory


def update2(
    db: AsyncSession, 
    id: int, 
    subcategory_update: SubcategoryUpdate
):
    subcategory = find_subcategory_by_id(db, id)

    if subcategory is None:
        return None
    
    stmt = (
        update(Subcategory).
        where(Subcategory.id == id).
        values(name=subcategory_update.name)
    )
    db.execute(stmt)
    db.commit()
    updated_subcategory = find_subcategory_by_id(db, id)
    return updated_subcategory


def delete_subcategory(
    db: AsyncSession, 
    id: int
) -> Optional[SubcategoryResponse]:
    subcategory = find_subcategory_by_id(db, id)
    if subcategory is None:
        return None
    
    questions = question_cruds.find_all_questions_in_subcategory(db, id)
    
    for question in questions:
        question_cruds.delete_question(db, question.id)
        
    db.delete(subcategory)
    db.commit()
    return subcategory
