import argparse
from sqlalchemy.orm import Session
from models2 import CategoryQuestion, SubcategoryQuestion, Question
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
    
    print(f"categoryquestionの存在しないレコードはquestion_idsの{not_existing_ids}になります。") 
        
    return not_existing_ids

def insert_missing_category_questions(db: Session):
    
    

    

def main():
    # データベースセッションを手動で作成
    with SessionLocal() as db:
        missing_records_question_ids = find_missing_category_questions(db)
        aaa = insert_missing_category_questions(db, missing_records_question_ids)

        if missing_records:
            for record in missing_records:
                print(f"Missing CategoryQuestion record with question_id: {record.question_id}")
        else:
            print("No missing records found.")

if __name__ == "__main__":
    main()
