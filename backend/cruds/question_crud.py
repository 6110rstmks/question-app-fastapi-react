from sqlalchemy.orm import Session
from sqlalchemy import select, update
from schemas.question import QuestionCreate, QuestionUpdate, QuestionIsCorrectUpdate
from schemas.problem import ProblemCreate
from models import Question, SubCategoryQuestion, CategoryQuestion
from sqlalchemy.exc import SQLAlchemyError
# from sqlalchemy.dialects import mysql
from . import category_question_crud as category_question_cruds
from . import subcategory_question_crud as subcategory_question_cruds

def find_all(db: Session):
    return db.query(Question).all()

def find_all_in_question(db: Session, question_id: int):
    query1 = select(SubCategoryQuestion).where(SubCategoryQuestion.question_id == question_id)
    return db.execute(query1).scalars().all()

def find_all_questions_in_category(db: Session, category_id: int):
    query = select(Question).where(CategoryQuestion.category_id == category_id)
    return db.execute(query).scalars().all()

def find_all_questions_in_subcategory(db: Session, subcategory_id: int):
    query1 = select(SubCategoryQuestion.question_id).where(SubCategoryQuestion.subcategory_id == subcategory_id)
    question_ids = db.execute(query1).scalars().all()
    query = select(Question).where(Question.id.in_(question_ids))
    return db.execute(query).scalars().all()

def find_by_id(db: Session, id: int):
    query = select(Question).where(Question.id == id)
    return db.execute(query).scalars().first()


def find_by_name(db: Session, name: str):
    return db.query(Question).filter(Question.name.like(f"%{name}%")).all()

def create(db: Session, question_create: QuestionCreate):
    try:
        question_data = question_create.model_dump(exclude={"category_id", "subcategory_id"})
        new_question = Question(**question_data)
        db.add(new_question)
        db.commit()

        new_category_question = CategoryQuestion(category_id=question_create.category_id, question_id=new_question.id)
        new_subcategory_question = SubCategoryQuestion(subcategory_id=question_create.subcategory_id, question_id=new_question.id)
        db.add(new_category_question)
        db.add(new_subcategory_question)
        db.commit()
        
        return new_question
    except SQLAlchemyError as e:
        db.rollback()
        raise e


def update2(db: Session, id: int, question_update: QuestionUpdate):
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
    updated_subcategory = find_by_id(db, id)
    return updated_subcategory

def update_correct_flg(db: Session, id: int, question_update: QuestionUpdate):
    question = find_by_id(db, id)
    if question is None:
        return None
    
    stmt = (
        update(Question).
        where(Question.id == id).
        values(is_correct=question_update.is_correct)
    )
    db.execute(stmt)
    db.commit()
    return question

def update_is_correct(db: Session, id: int, question_is_correct_update: QuestionIsCorrectUpdate):
    question = find_by_id(db, id)
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

def delete(db: Session, id: int):
    question = find_by_id(db, id)
    if question is None:
        return None
    
    subcategory_question_cruds.delete(db, id)
    category_question_cruds.delete(db, id)   
    db.delete(question)
    db.commit()
    return question
