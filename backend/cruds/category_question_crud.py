from sqlalchemy.orm import Session
from sqlalchemy import select
from models import CategoryQuestion

def find_all(db: Session):
    return db.query(CategoryQuestion).all()

def find_categoryquestion_by_question_id(db: Session, id: int):
    query = select(CategoryQuestion).where(CategoryQuestion.question_id == id)
    print(444029)
    print(db.execute(query).all())
    return db.execute(query).scalars().first()

def find_categoriesquestions_by_question_id(db: Session, id: int):
    query = select(CategoryQuestion).where(CategoryQuestion.question_id == id)
    return db.execute(query).scalars().all()

def delete(db: Session, question_id: int):
    categoriesquestions = find_categoriesquestions_by_question_id(db, question_id)
    if categoriesquestions is None:
        return None
    
    for categoryquestion in categoriesquestions:
        db.delete(categoryquestion)
    db.commit()
    return categoryquestion