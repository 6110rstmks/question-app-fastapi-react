from sqlalchemy.orm import Session
from sqlalchemy import select, update
from schemas.question import QuestionCreate, QuestionUpdate, QuestionIsCorrectUpdate
from schemas.problem import ProblemCreate
from models import Question, SubCategoryQuestion, CategoryQuestion
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from sqlalchemy.dialects import mysql
from . import category_question as category_question_cruds
from . import subcategory_question as subcategory_question_cruds


def find_all(db: Session):
    return db.query(Question).all()

def find_all_in_question(db: Session, question_id: int):
    query1 = select(SubCategoryQuestion).where(SubCategoryQuestion.question_id == question_id)
    print(query1)
    
    # query = select(Question).where(SubcategoryQuestion.question_id == question_id)
    return db.execute(query1).scalars().all()

def find_all_questions_in_category(db: Session, category_id: int):
    query = select(Question).where(CategoryQuestion.category_id == category_id)
    return db.execute(query).scalars().all()

def find_all_questions_in_subcategory(db: Session, subcategory_id: int):
    query1 = select(SubCategoryQuestion.question_id).where(SubCategoryQuestion.subcategory_id == subcategory_id)
    question_ids = db.execute(query1).scalars().all()
    print(question_ids)
    query = select(Question).where(Question.id.in_(question_ids))
    return db.execute(query).scalars().all()

def find_by_id(db: Session, id: int):
    query = select(Question).where(Question.id == id)
    return db.execute(query).scalars().first()

# 問題を出題する
def generate_problems(db: Session, problem_create: ProblemCreate):
    if problem_create.type == "random":
        query2 = select(Question).order_by(func.random()).limit(10)

    elif problem_create.type == "category":
        print(problem_create.category_ids)
        query1 = select(CategoryQuestion).where(CategoryQuestion.category_id.in_(problem_create.category_ids))
        results = db.execute(query1).scalars().all()
        
        question_ids = [question.question_id for question in results]
        print(question_ids)
        
        query2 = select(Question).where(Question.id.in_(question_ids))
    else:
        return '不明なものが入力されました。'
    return db.execute(query2).scalars().all()

    

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


def update_name(db: Session, id: int, question_update: QuestionUpdate, category_id: int, question_id: int):
    question = find_by_id(db, id)
    if question is None:
        return None

    question.name = question.name if question_update.name is None else question_update.name
    db.add(question)
    db.commit()
    return question

def update_is_correct(db: Session, id: int, question_is_correct_update: QuestionIsCorrectUpdate):
    question = find_by_id(db, id)
    if question is None:
        return None

    stmt = (
        update(Question).
        where(Question.id == id).
        values(name=question_is_correct_update.is_correct)
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
