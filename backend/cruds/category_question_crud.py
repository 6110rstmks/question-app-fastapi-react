from sqlalchemy.orm import Session
from sqlalchemy import select
from models2 import CategoryQuestion

def find_all(db: Session):
    return db.query(CategoryQuestion).all()

def find_categoryquestion_by_question_id(db: Session, id: int):
    print(987397)
    query = select(CategoryQuestion).where(CategoryQuestion.question_id == id)
    return db.execute(query).scalars().first()

def delete(db: Session, question_id: int):
    categoryquestion = find_categoryquestion_by_question_id(db, question_id)
    if categoryquestion is None:
        return None
    db.delete(categoryquestion)
    db.commit()
    return categoryquestion