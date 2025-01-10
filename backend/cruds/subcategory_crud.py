from sqlalchemy.orm import Session
from sqlalchemy import select, update, func
from schemas.subcategory import SubcategoryCreate, SubcategoryUpdate
from models import Subcategory, SubcategoryQuestion
from . import question_crud as question_cruds
from . import subcategory_question_crud as subcategory_question_cruds
from fastapi import HTTPException

def find_subcategories_in_category(db: Session, category_id: int, limit: int, searchSubcategoryWord: str):
    print(category_id)
    
    if searchSubcategoryWord:
        query = select(Subcategory).where(Subcategory.category_id == category_id).where(Subcategory.name.istartswith(f"%{searchSubcategoryWord}%"))
        print(3332211)
    
    else:     
        print(3334928)  
        query = select(Subcategory).where(Subcategory.category_id == category_id)

    result = db.execute(query).scalars().all()

    # サブカテゴリに紐づくQuestion数を取得
    for subcategory in result:
        subcategory.question_count = len(subcategory.questions)
        print(subcategory.name)
    
    if limit is None:  # limitが指定されていない場合
        return result
    
    # 6件まで表示
    return result[0: 0 + limit]

def find_subcategory_by_id(db: Session, id: int):
    query = select(Subcategory).where(Subcategory.id == id)
    return db.execute(query).scalars().first()

def find_subcategories_by_question_id(db: Session, question_id: int):
    query = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id == question_id)
    results = db.execute(query).scalars().all()
    
    subcategory_ids = []
    for result in results:
        print(result.subcategory_id)
        subcategory_ids.append(result.subcategory_id)
        
    query2 = select(Subcategory).where(Subcategory.id.in_(subcategory_ids))
        
    return db.execute(query2).scalars().all()

def find_subcategory_by_name(db: Session, name: str):
    return db.query(Subcategory).filter(Subcategory.name.like(f"%{name}%")).all()

def create_subcategory(db: Session, subcategory_create: SubcategoryCreate):

    existing_subcategory = (
        db.query(Subcategory)
        .filter(Subcategory.name == subcategory_create.name)
        .first()
    )
    
    if existing_subcategory:
        return HTTPException(status_code=400, detail="Subcategory already exists")

    new_subcategory = Subcategory(**subcategory_create.model_dump())
    db.add(new_subcategory)
    db.commit()
    return new_subcategory

def update2(db: Session, id: int, subcategory_update: SubcategoryUpdate):
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

def delete_subcategory(db: Session, id: int):
    subcategory = find_subcategory_by_id(db, id)
    if subcategory is None:
        return None
    
    questions = question_cruds.find_all_questions_in_subcategory(db, id)
    
    for question in questions:
        question_cruds.delete(db, question.id)
        
    db.delete(subcategory)
    db.commit()
    return subcategory
