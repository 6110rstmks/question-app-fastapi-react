from datetime import date, timedelta

from sqlalchemy.orm import Session
from typing import Optional


from models import Question, SubcategoryQuestion, CategoryQuestion
from schemas.question import QuestionCreateSchema, QuestionResponse, QuestionUpdateSchema, QuestionIsCorrectUpdate, QuestionBelongsToSubcategoryIdUpdate

from src.repository.question_repository import QuestionRepository, QuestionCreate, QuestionUpdate, QuestionRead
from src.repository.category_question_repository import CategoryQuestionRepository, CategoryQuestionCreate
from src.repository.subcategory_question_repository import SubcategoryQuestionRepository, SubcategoryQuestionCreate
from database import SessionDependency


# リポジトリパターンに置換済み
async def find_all_questions(
    search_word: str = None,
    session=SessionDependency,
) -> list[QuestionRead]:
    result = []

    question_repository = QuestionRepository(session)
    result = await question_repository.get_all()

    if search_word:
        result_a = await question_repository.find_by_problem_contains(search_word)
        result_b = await question_repository.find_by_answer_contains(search_word)
        result = list({q.id: q for q in (result_a + result_b)}.values())

    return result

# リポジトリパターンに置換済み
async def find_all_questions_in_subcategory(
    subcategory_id: int,
    session=SessionDependency,
) -> list[QuestionRead]:
    subcategory_question_repository = SubcategoryQuestionRepository(session)
    question_repository = QuestionRepository(session)

    subcategoriesquestions = await subcategory_question_repository.find_by_subcategory_id(subcategory_id)
    question_ids = [subcategoryquestion.question_id for subcategoryquestion in subcategoriesquestions]

    questions = await question_repository.find_by_ids(question_ids)

    # 必要であれば、取得した質問データの'IS_CORRECT'を文字列に変換
    for question in questions:
        question.is_correct = question.is_correct.value  # Enumを文字列に変換
        
    return questions

# リポジトリパターンに置換済み
async def create(
    question_create: QuestionCreateSchema,
    session=SessionDependency
) -> QuestionResponse:
    
    # async with session.begin():
    question_repository = QuestionRepository(session)
    category_question_repository = CategoryQuestionRepository(session)
    subcategory_question_repository = SubcategoryQuestionRepository(session)

    question = await question_repository.create(
        QuestionCreate(
            problem=question_create.problem, 
            answer=question_create.answer, 
            memo=question_create.memo, 
            last_answered_date=date.today()
        )
    # , autocommit=False
    )

    await category_question_repository.create(
        CategoryQuestionCreate(
            category_id=question_create.category_id, 
            question_id=question.id
        )
    # , autocommit=False
    )

    await subcategory_question_repository.create(
        SubcategoryQuestionCreate(
            subcategory_id=question_create.subcategory_id, 
            question_id=question.id
        )
    # , autocommit=False
    )

    return question

# リポジトリパターンに置換済み
async def update_question(
    id: int, 
    question_update: QuestionUpdateSchema,
    session=SessionDependency, 
) -> Optional[QuestionRead]:

    question_repository = QuestionRepository(session)
    updated_question = await question_repository.update(
        id,
        QuestionUpdate(
            problem=question_update.problem,
            answer=question_update.answer,
            memo=question_update.memo,
            is_correct=question_update.is_correct
        )
    )

    return updated_question

# リポジトリパターンに置換済み
async def update_is_correct(
    id: int, 
    question_is_correct_update: QuestionIsCorrectUpdate,
    session=SessionDependency, 
) -> Optional[QuestionResponse]:

    question_repository = QuestionRepository(session)
    updated_question = await question_repository.update(
        id,
        QuestionUpdate(is_correct=question_is_correct_update.is_correct)
    )
    return updated_question


# あるサブカテゴリのis_correctをすべて更新する関数
# async def update_is_correct_by_subcategory(
#     db: AsyncSession,
#     subcategory_id: int,
#     question_is_correct_update: QuestionIsCorrectUpdate
# ) -> list[QuestionResponse]:
#     # サブカテゴリに属するすべての質問を取得
#     query = select(SubcategoryQuestion).where(SubcategoryQuestion.subcategory_id == subcategory_id)
#     subcategoriesquestions = db.execute(query).scalars().all()
    
#     updated_questions = []
    
#     for subcategoryquestion in subcategoriesquestions:
#         question = await find_question_by_id(db, subcategoryquestion.question_id)
#         if question is not None:
#             stmt = (
#                 update(Question).
#                 where(Question.id == question.id).
#                 values(is_correct=question_is_correct_update.is_correct)
#             )
#             db.execute(stmt)
#             db.commit()
#             updated_questions.append(question)

#     return updated_questions

# リポジトリパターンに置換済み
async def delete_question(
    question_id: int,
    session=SessionDependency,
) -> None:

    category_question_repository = CategoryQuestionRepository(session)
    subcategory_question_repository = SubcategoryQuestionRepository(session)
    question_repository = QuestionRepository(session)

    await category_question_repository.delete_by_question_id(question_id)
    await subcategory_question_repository.delete_by_question_id(question_id)
    await question_repository.delete(question_id)
    return 

def change_belongs_to_subcategoryId(
    db: Session, 
    changeSubcategoryUpdate: QuestionBelongsToSubcategoryIdUpdate
) -> list[int]:

    # ------------------------------------------------------------------------ #
    # チェックボックスが外された場合のSubcategory削除処理
    # ------------------------------------------------------------------------ #

    # チェックボックスが外された場合は、SubcategoryQuestionから削除する。
    query = db.query(SubcategoryQuestion).where(SubcategoryQuestion.question_id ==changeSubcategoryUpdate.question_id)
    results = db.execute(query).scalars().all()
    current_subcategory_ids = []
    for result in results:
        current_subcategory_ids.append(result.subcategory_id)
    
    # current_subcategoriesとchangeSubcategoryUpdate.subcategory_idsの差分を取得
    # delete_subcategory_idsが削除対象のSubcategory
    delete_subcategory_ids = list(set(current_subcategory_ids) - set(changeSubcategoryUpdate.subcategory_ids))
    
    for delete_subcategory_id in delete_subcategory_ids:
        # 重複チェック
        existing_record = db.query(SubcategoryQuestion).filter_by(
            subcategory_id=delete_subcategory_id,
            question_id=changeSubcategoryUpdate.question_id
        ).first()
        
        # レコードが存在する場合のみ削除
        if existing_record:
            db.delete(existing_record)
            db.commit()
        
    # ------------------------------------------------------------------------ #
    # チェックボックスにチェックがついた場合のSubcategory追加処理
    # ------------------------------------------------------------------------ #
    
    for subcategory_id in changeSubcategoryUpdate.subcategory_ids:
        # 重複チェック
        existing_subcategory_question_record = db.query(SubcategoryQuestion).filter_by(
            subcategory_id=subcategory_id,
            question_id=changeSubcategoryUpdate.question_id
        ).first()
        
        # レコードが存在しない場合のみ挿入
        if not existing_subcategory_question_record:
            new_subcategory_question = SubcategoryQuestion(
                subcategory_id=subcategory_id, 
                question_id=changeSubcategoryUpdate.question_id
            )
            db.add(new_subcategory_question)
            db.commit()
                        
    # ------------------------------------------------------------------------ #
    # チェックボックスが外された場合のCategory削除処理
    # ------------------------------------------------------------------------ #
    
    query = db.query(CategoryQuestion).where(CategoryQuestion.question_id ==changeSubcategoryUpdate.question_id)
    results = db.execute(query).scalars().all()
    current_category_ids = []
    for result in results:
        current_category_ids.append(result.category_id)
        
    # current_categoriesとchangeSubcategoryUpdate.category_idsの差分を取得
    # delete_category_idsが削除対象のCategory
    delete_category_ids = list(set(current_category_ids) - set(changeSubcategoryUpdate.category_ids))
    
    for delete_category_id in delete_category_ids:
        # 重複チェック
        existing_category_question_record = db.query(CategoryQuestion).filter_by(
            category_id=delete_category_id,
            question_id=changeSubcategoryUpdate.question_id
        ).first()
        
        # レコードが存在する場合のみ削除
        if existing_category_question_record:
            db.delete(existing_category_question_record)
            db.commit()
            
    
    # ------------------------------------------------------------------------ #
    # チェックボックスにチェックがついた場合のCategory追加処理
    # ------------------------------------------------------------------------ #

    for category_id in changeSubcategoryUpdate.category_ids:
        # 重複チェック
        existing_category_question_record = db.query(CategoryQuestion).filter_by(
            category_id=category_id,
            question_id=changeSubcategoryUpdate.question_id
        ).first()
        
        # レコードが存在しない場合のみ挿入
        if not existing_category_question_record:
            new_category_question = CategoryQuestion(
                category_id=category_id, 
                question_id=changeSubcategoryUpdate.question_id
            )
            db.add(new_category_question)
            db.commit()

    return changeSubcategoryUpdate.subcategory_ids

# リポジトリパターンに置換済み
async def update_last_answered_date(
    question_id: int,
    session=SessionDependency
) -> Optional[QuestionRead]:
    question_repository = QuestionRepository(session)
    question = await question_repository.get(question_id)

    # last_answered_dateが現在日付の場合は、
    # last_answered_dateに現在日付の翌日をセットする。
    if question.last_answered_date == date.today():
        updated_question = await question_repository.update(
            question_id,
            QuestionUpdate(last_answered_date=date.today() + timedelta(days=1))
        )

    else:
        updated_question = await question_repository.update(
            question_id,
            QuestionUpdate(last_answered_date=date.today())
        )

    return updated_question


async def update_skip_until(
    question_id: int,
    session=SessionDependency
) -> Optional[QuestionRead]:
    question_repository = QuestionRepository(session)
    updated_question = await question_repository.update(
        question_id,
        QuestionUpdate(skip_until=date.today())
    )
    return updated_question

# リポジトリパターンに置換済み
async def increment_answer_count(
    question_id: int,
    session=SessionDependency
) -> Optional[QuestionRead]:
    question_repository = QuestionRepository(session)
    return await question_repository.update(
        question_id,
        QuestionUpdate(answer_count=1)
    )
    
