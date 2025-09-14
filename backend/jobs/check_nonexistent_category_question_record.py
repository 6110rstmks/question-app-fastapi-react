# python -m jobs.check_nonexistent_category_question_record
# で実行する

from sqlalchemy.orm import Session
from models import CategoryQuestion, SubcategoryQuestion, Question, Subcategory
from sqlalchemy import select, exists
from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import create_engine
from config import get_settings

SQLALCHEMY_DATABASE_URL = get_settings().sqlalchemy_database_url

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DbDependency = Annotated[Session, Depends(get_db)]

def find_missing_category_questions(db: Session):
    """
    Question テーブルに存在する question_id を持っているが、
    CategoryQuestion テーブルに question_id がないレコードを取得
    """
    query = select(CategoryQuestion).where(
        ~exists().where(CategoryQuestion.question_id == Question.id)
    )
    
    query1 = select(Question.id)
    result = db.execute(query1)  # クエリを実行
    question_ids = result.scalars().all()
    
    not_existing_ids = []
    for question_id in question_ids:
        query2 = select(CategoryQuestion).where(CategoryQuestion.question_id == question_id)
        result = db.execute(query2)
        if not result.scalars().all():
            not_existing_ids.append(question_id)
    
        
    return not_existing_ids

def insert_missing_category_questions(db: Session, missing_records_question_ids):
    
    query3 = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id.in_(missing_records_question_ids))
    subcategories_questions = db.execute(query3).scalars().all()
    
    for subcategory_question in subcategories_questions:
        query4 = select(Subcategory).where(Subcategory.id == subcategory_question.subcategory_id)
        subcategory = db.execute(query4).scalars().first()

        subcategory_question.category_id = subcategory.category_id

        
    new_category_questions = [
        CategoryQuestion(
            category_id=subcategory_question.category_id,
            question_id=subcategory_question.question_id
        )
        for subcategory_question in subcategories_questions
    ]
    
    db.add_all(new_category_questions)
    db.commit()
        
    return subcategories_questions

def main():
    # データベースセッションを手動で作成
    with SessionLocal() as db:
        missing_records_question_ids = find_missing_category_questions(db)

        if not missing_records_question_ids:
            print("categoryquestionの存在しないレコードはありません。")
            return
        
        else:
            print(f"categoryquestionの存在しないレコードはquestion_idsの{missing_records_question_ids}になります。") 
        


if __name__ == "__main__":
    main()
