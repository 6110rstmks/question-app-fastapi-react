import argparse
from sqlalchemy.orm import Session
from models2 import CategoryQuestion, Question
from sqlalchemy import select, exists

def find_missing_category_questions(db: Session):
    """
    Question テーブルに存在する question_id を持っているが、
    CategoryQuestion テーブルに question_id がないレコードを取得
    """
    query = select(CategoryQuestion).where(
        ~exists().where(CategoryQuestion.question_id == Question.id)
    )
    return db.execute(query).scalars().all()

def main():
    parser = argparse.ArgumentParser(description="Find CategoryQuestion records with missing question_id.")
    args = parser.parse_args()
    
    # データベースセッションを作成
    with Session as session:
        missing_records = find_missing_category_questions(session)
        if missing_records:
            for record in missing_records:
                print(f"Missing CategoryQuestion record with question_id: {record.question_id}")
        else:
            print("No missing records found.")

if __name__ == "__main__":
    main()
