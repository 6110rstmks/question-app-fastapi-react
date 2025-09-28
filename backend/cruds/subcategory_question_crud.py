from sqlalchemy.orm import Session
from sqlalchemy import select
from models import SubcategoryQuestion


def find_subcategoriesquestions_by_question_id(db: Session, question_id: int):
    query = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id == question_id)
    return db.execute(query).scalars().all()
