from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models import SubcategoryQuestion

def find_all(db: Session):
    return db.query(SubcategoryQuestion).all()

def find_subcategoriesquestions_by_question_id(db: Session, question_id: int):
    query = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id == question_id)
    return db.execute(query).scalars().all()

def find_subcategoryquestion_by_question_id(db: Session, id: int):
    query = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id == id)
    return db.execute(query).scalars().first()

def delete_subcategoriesquestions(db: Session, question_id: int):
    subcategoriesquestions = find_subcategoriesquestions_by_question_id(db, question_id)
    if subcategoriesquestions is None:
        return None
    
    for subcategoryquestion in subcategoriesquestions:
        db.delete(subcategoryquestion)
    db.commit()
    return subcategoriesquestions