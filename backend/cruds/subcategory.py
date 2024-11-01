from sqlalchemy.orm import Session
from sqlalchemy import select
from schemas.subcategory import SubCategoryCreate, SubCategoryUpdate
from models import SubCategory, SubCategoryQuestion
from . import question as question_cruds
from . import subcategory_question as subcategory_question_cruds



def find_all(db: Session):
    return db.query(SubCategory).all()

def find_all_subcategories_in_category(db: Session, category_id: int):
    query = select(SubCategory).where(SubCategory.category_id == category_id)
    return db.execute(query).scalars().all()

def find_by_id(db: Session, id: int):
    query = select(SubCategory).where(SubCategory.id == id)
    return db.execute(query).scalars().first()

def find_by_name(db: Session, name: str):
    return db.query(SubCategory).filter(SubCategory.name.like(f"%{name}%")).all()

def create(db: Session, subcategory_create: SubCategoryCreate):
    new_subcategory = SubCategory(**subcategory_create.model_dump())
    db.add(new_subcategory)
    db.commit()
    return new_subcategory


def update(db: Session, id: int, subcategory_update: SubCategoryUpdate, user_id: int):
    subcategory = find_by_id(db, id)
    if subcategory is None:
        return None

    subcategory.name = subcategory.name if subcategory_update.name is None else subcategory_update.name
    db.add(subcategory)
    db.commit()
    return subcategory


def delete(db: Session, id: int):
    subcategory = find_by_id(db, id)
    if subcategory is None:
        return None
    
    # subcategoryquestion = subcategory_question_cruds.find_by_subcategory_id(db, id)
    # if subcategoryquestion:
    #     db.delete(subcategoryquestion)
    
    questions = question_cruds.find_all_questions_in_subcategory(db, id)
    
    
    for question in questions:
        print(991112223)
        question_cruds.delete(db, question.id)
        print(24445656)
        
    db.delete(subcategory)
    print(7777777777)
    db.commit()
    print(5555555)
    return subcategory
