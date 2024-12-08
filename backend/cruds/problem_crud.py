from sqlalchemy.orm import Session
from schemas.problem import ProblemCreate
from sqlalchemy import select
from sqlalchemy import func
from models import Question, CategoryQuestion

# 問題を出題する
def generate_problems(db: Session, problem_create: ProblemCreate):
    if problem_create.type == "random":
        query2 = select(Question).order_by(func.random()).limit(problem_create.problem_cnt)

    elif problem_create.type == "category":
        query1 = select(CategoryQuestion).where(CategoryQuestion.category_id.in_(problem_create.category_ids))
        results = db.execute(query1).scalars().all()
        
        question_ids = [question.question_id for question in results]        
        query2 = select(Question).where(Question.id.in_(question_ids)).limit(problem_create.problem_cnt)
    else:
        return '不明なものが入力されました。'
    return db.execute(query2).scalars().all()