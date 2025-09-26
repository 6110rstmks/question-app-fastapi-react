# python -m jobs.insert_nonexistent_category_question_record
# で実行する

from models import CategoryQuestion, SubcategoryQuestion, Question, Subcategory
from sqlalchemy import select, exists

from jobs.check_nonexistent_category_question_record import find_missing_category_questions

import asyncio

from database import SessionDependency, AsyncSessionLocal

# 以下を削除するとエラーになる。
from src.repository.category_repository import CategorySchema

from src.repository.subcategory_repository import SubcategoryRepository
from src.repository.category_question_repository import CategoryQuestionRepository, CategoryQuestionCreate
from src.repository.question_repository import QuestionRepository
from src.repository.subcategory_question_repository import SubcategoryQuestionRepository, SubcategoryQuestionRead
from src.repository.base.BasicDao import BaseSchema

class SubcategoryQuestionReadWithCategory(SubcategoryQuestionRead):
    category_id: int

async def insert_missing_category_questions(
    missing_records_question_ids: list[int],
    session=SessionDependency
):
    """
    CategoryQuestionテーブルに存在しないquestion_idを持つSubcategoryQuestionレコードを取得し、
    CategoryQuestionテーブルに新たにレコードを追加する。
    """
    category_question_repository = CategoryQuestionRepository(session)
    subcategory_repository = SubcategoryRepository(session)
    subcategories_question_repository = SubcategoryQuestionRepository(session)

    subcategories_questions = await subcategories_question_repository.find_by_question_ids(missing_records_question_ids)
    

    # query3 = select(SubcategoryQuestion).where(SubcategoryQuestion.question_id.in_(missing_records_question_ids))
    # subcategories_questions = db.execute(query3).scalars().all()
    
    # for subcategory_question in subcategories_questions:
    #     # query4 = select(Subcategory).where(Subcategory.id == subcategory_question.subcategory_id)
    #     # subcategory = db.execute(query4).scalars().first()
    #     subcategory = await subcategory_repository.get(subcategory_question.subcategory_id)

        # subcategory_question.category_id = subcategory.category_id

    subcategories_questions_with_category = []

    for subcategory_question in subcategories_questions:
        subcategory = await subcategory_repository.get(subcategory_question.subcategory_id)
        if subcategory:
            # SubcategoryQuestionRead を dict にして category_id を追加
            sq_with_category = SubcategoryQuestionReadWithCategory(
                **subcategory_question.dict(),
                category_id=subcategory.category_id
            )
            subcategories_questions_with_category.append(sq_with_category)
        else:
            print(f"Subcategory with ID {subcategory_question.subcategory_id} not found.")
            continue     
        
    new_category_questions = [
        CategoryQuestionCreate(
            category_id=subcategory_question.category_id,
            question_id=subcategory_question.question_id
        )
        for subcategory_question in subcategories_questions_with_category
    ]
    
    count = await category_question_repository.create_many(new_category_questions)
    return None

async def main():
    # データベースセッションを手動で作成
    async with AsyncSessionLocal() as session:
        missing_records_question_ids = await find_missing_category_questions(session)

        if not missing_records_question_ids:
            print("categoryquestionの存在しないレコードはありません。")
            return
        await insert_missing_category_questions(missing_records_question_ids, session)

if __name__ == "__main__":
    asyncio.run(main())
