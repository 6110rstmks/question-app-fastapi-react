from sqlalchemy.orm import Session
from sqlalchemy import select
from schemas.subcategory import SubcategoryCreate, SubcategoryUpdate
from models import SubcategoryQuestion

def find_all(db: Session):
    return db.query(SubcategoryQuestion).all()

def find_subcategory_question_by_question_id(db, question_id: int):
    query = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id == question_id)
    return db.execute(query).scalars().all()

def find_by_question_id(db: Session, id: int):
    query = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id == id)
    return db.execute(query).scalars().first()




def delete(db: Session, question_id: int):
    subcategoryquestion = find_by_question_id(db, question_id)
    if subcategoryquestion is None:
        return None
    db.delete(subcategoryquestion)
    db.commit()
    return subcategoryquestion