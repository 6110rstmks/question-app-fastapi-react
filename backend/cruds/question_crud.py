from sqlalchemy.orm import Session
from sqlalchemy import select, update, func, text, delete
from backend.schemas.question import QuestionCreate, QuestionUpdate, QuestionIsCorrectUpdate, QuestionBelongsToSubcategoryIdUpdate
from backend.models import Question, SubcategoryQuestion, CategoryQuestion
from sqlalchemy.exc import SQLAlchemyError
from backend.cruds import category_question_crud as category_question_cruds
from backend.cruds import subcategory_question_crud as subcategory_question_cruds
from datetime import date
from backend.schemas.question import QuestionResponse

def find_all_questions(
    db: Session,
    search_word: str = None,
) -> list[QuestionResponse]:
    result = []
    
    result = db.query(Question).all()

    if search_word:
        # 問題文で検索
        result_a = db.query(Question).filter(
            Question.problem.ilike(f"%{search_word}%")
        ).all()

        query1 = select(Question).where(
            func.array_to_string(Question.answer, ',').ilike(f"%{search_word}%")
        )
        result_b = db.execute(query1).scalars().all()
        
        result = list({q.id: q for q in (result_a + result_b)}.values())

    return result


def find_all_questions_in_category(
    db: Session, 
    category_id: int
) -> list[QuestionResponse]:
    query = select(Question).where(CategoryQuestion.category_id == category_id)

    return db.execute(query).scalars().all()

def find_all_questions_in_subcategory(
    db: Session, 
    subcategory_id: int
) -> list[Question]:

    query1 = select(SubcategoryQuestion).where(SubcategoryQuestion.subcategory_id == subcategory_id)
    subcategoriesquestions = db.execute(query1).scalars().all()
    questions = [subcategoryquestion.question for subcategoryquestion in subcategoriesquestions]

        # 必要であれば、取得した質問データの'IS_CORRECT'を文字列に変換
    for question in questions:
        question.is_correct = question.is_correct.value  # Enumを文字列に変換
        
    return questions

def find_question_by_id(db: Session, id: int) -> Question:
    query = select(Question).where(Question.id == id)
    return db.execute(query).scalars().first()

def find_by_name(db: Session, name: str) -> list[Question]:
    return db.query(Question).filter(Question.name.like(f"%{name}%")).all()

def create(
    db: Session, 
    question_create: QuestionCreate
) -> QuestionResponse:
    
    try:
        question_data = question_create.model_dump(exclude={"category_id", "subcategory_id"})
        new_question = Question(
            **question_data,
            last_answered_date=func.current_date()
        )
        db.add(new_question)
        db.commit()

        new_category_question = CategoryQuestion(category_id=question_create.category_id, question_id=new_question.id)
        new_subcategory_question = SubcategoryQuestion(subcategory_id=question_create.subcategory_id, question_id=new_question.id)
        db.add(new_category_question)
        db.add(new_subcategory_question)
        db.commit()
        
        return new_question
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def update2(
    db: Session, 
    id: int, 
    question_update: QuestionUpdate
) -> QuestionResponse:
    stmt = (
        update(Question).
        where(Question.id == id).
        values(
                problem=question_update.problem,
                answer=question_update.answer,
                memo=question_update.memo,
                is_correct=question_update.is_correct
               )
    )
    db.execute(stmt)
    db.commit()
    updated_subcategory = find_question_by_id(db, id)
    return updated_subcategory

def update_is_correct(
    db: Session, 
    id: int, 
    question_is_correct_update: QuestionIsCorrectUpdate
) -> QuestionResponse:
    question = find_question_by_id(db, id)
    if question is None:
        return None

    stmt = (
        update(Question).
        where(Question.id == id).
        values(is_correct=question_is_correct_update.is_correct)
    )
    db.execute(stmt)
    db.commit()
    return question

# あるサブカテゴリのis_correctをすべて更新する関数
def update_is_correct_by_subcategory(
    db: Session,
    subcategory_id: int,
    question_is_correct_update: QuestionIsCorrectUpdate
) -> list[QuestionResponse]:
    # サブカテゴリに属するすべての質問を取得
    query = select(SubcategoryQuestion).where(SubcategoryQuestion.subcategory_id == subcategory_id)
    subcategoriesquestions = db.execute(query).scalars().all()
    
    updated_questions = []
    
    for subcategoryquestion in subcategoriesquestions:
        question = find_question_by_id(db, subcategoryquestion.question_id)
        if question is not None:
            stmt = (
                update(Question).
                where(Question.id == question.id).
                values(is_correct=question_is_correct_update.is_correct)
            )
            db.execute(stmt)
            db.commit()
            updated_questions.append(question)

    return updated_questions

def delete_question(
    db: Session,
    question_id: int
) -> QuestionResponse:
    question = find_question_by_id(db, question_id)
    if question is None:
        return None
    
    subcategory_question_cruds.delete_subcategoriesquestions(db, question_id)
    category_question_cruds.delete(db, question_id)   
    db.delete(question)
    db.commit()
    return question

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

def update_last_answered_date(
    db: Session, 
    question_id: int
) -> QuestionResponse:
    query1 = select(Question).where(Question.id == question_id)
    question = db.execute(query1).scalars().first()
    # last_answered_dateが現在日付の場合は、
    # last_answered_dateに現在日付の翌日をセットする。
    if question.last_answered_date == date.today():
        stmt = (
            update(Question).
            where(Question.id == question_id).
            values(
                last_answered_date=func.current_date() + text("INTERVAL '1 day'")
            )
        )

    else:
        # last_answered_dateが現在日づげでない場合はlast_answered_dateを現在日付に更新。
        stmt = (
            update(Question).
            where(Question.id == question_id).
            values(
                last_answered_date=func.current_date()
            )
        )
    db.execute(stmt)
    db.commit()
    return find_question_by_id(db, question_id) 

def increment_answer_count(
    db: Session, 
    question_id: int
) -> QuestionResponse:
    stmt = (
        update(Question).
        where(Question.id == question_id).
        values(
            answer_count=Question.answer_count + 1
        )
    )
    db.execute(stmt)
    db.commit()
    return find_question_by_id(db, question_id)