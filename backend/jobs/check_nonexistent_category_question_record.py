"""
以下のコマンドで実行する。
python -m jobs.check_nonexistent_category_question_record
"""

import asyncio

from src.repository.category_question_repository import CategoryQuestionRepository
from src.repository.question_repository import QuestionRepository

from database import SessionDependency, AsyncSessionLocal

async def find_missing_category_questions(session=SessionDependency):
    """
    Question テーブルに存在する question_id を持っているが、
    CategoryQuestion テーブルに question_id がないレコードを取得
    """
    category_question_repository = CategoryQuestionRepository(session)
    question_repository = QuestionRepository(session)

    questions = await question_repository.get_all()
    question_ids = [question.id for question in questions]
    
    not_existing_ids = []
    for question_id in question_ids:
        category_questions = await category_question_repository.find_by_question_id(question_id)
        if not category_questions:
            not_existing_ids.append(question_id)
        
    return not_existing_ids


async def main():
    # データベースセッションを手動で作成
    async with AsyncSessionLocal() as session:
        missing_records_question_ids = await find_missing_category_questions(session)

        if not missing_records_question_ids:
            print("categoryquestionの存在しないレコードはありません。")
            return
        
        else:
            print(f"categoryquestionの存在しないレコードはquestion_idsの{missing_records_question_ids}になります。") 

if __name__ == "__main__":
    asyncio.run(main())
