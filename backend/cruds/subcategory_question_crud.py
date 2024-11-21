from sqlalchemy.orm import Session
from sqlalchemy import select
from schemas.subcategory import SubCategoryCreate, SubCategoryUpdate
from models import SubCategoryQuestion

def find_all(db: Session):
    return db.query(SubCategoryQuestion).all()

def find_by_question_id(db: Session, id: int):
    query = select(SubCategoryQuestion).where(SubCategoryQuestion.question_id == id)
    return db.execute(query).scalars().first()


def delete(db: Session, question_id: int):
    subcategoryquestion = find_by_question_id(db, question_id)
    if subcategoryquestion is None:
        return None
    db.delete(subcategoryquestion)
    db.commit()
    return subcategoryquestion