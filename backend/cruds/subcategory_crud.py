from sqlalchemy.orm import Session
from sqlalchemy import select, update
from schemas.subcategory import SubcategoryCreate, SubcategoryUpdate
from models import Subcategory, SubcategoryQuestion
from . import question_crud as question_cruds
from . import subcategory_question_crud as subcategory_question_cruds
from fastapi import HTTPException

def find_all(db: Session):
    return db.query(Subcategory).all()

def find_subcategories_in_category(db: Session, category_id: int, limit: int):       
    query = select(Subcategory).where(Subcategory.category_id == category_id)
    result = db.execute(query).scalars().all()
    
    if limit is None:  # limitが指定されていない場合
        return result
    
    # 6件まで表示
    return result[0: 0 + limit]

def find_by_id(db: Session, id: int):
    query = select(Subcategory).where(Subcategory.id == id)
    return db.execute(query).scalars().first()

def find_by_name(db: Session, name: str):
    return db.query(Subcategory).filter(Subcategory.name.like(f"%{name}%")).all()

def create(db: Session, subcategory_create: SubcategoryCreate):

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
    subcategory = find_by_id(db, id)
    if subcategory is None:
        return None
    
    stmt = (
        update(Subcategory).
        where(Subcategory.id == id).
        values(name=subcategory_update.name)
    )
    db.execute(stmt)
    db.commit()
    updated_subcategory = find_by_id(db, id)
    return updated_subcategory

def delete(db: Session, id: int):
    subcategory = find_by_id(db, id)
    if subcategory is None:
        return None
    
    # subcategoryquestion = subcategory_question_cruds.find_by_subcategory_id(db, id)
    # if subcategoryquestion:
    #     db.delete(subcategoryquestion)
    
    questions = question_cruds.find_all_questions_in_subcategory(db, id)
    
    
    for question in questions:
        question_cruds.delete(db, question.id)
        
    db.delete(subcategory)
    db.commit()
    return subcategory
