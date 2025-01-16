from sqlalchemy.orm import Session
from schemas.problem import ProblemCreate
from sqlalchemy import select, func
from models import Question, CategoryQuestion
from sqlalchemy.sql.expression import false

# 問題を出題する
def generate_problems(db: Session, problem_create: ProblemCreate):
    if problem_create.type == "random" and problem_create.incorrected_only_flg == False:
        query2 = select(Question).order_by(func.random()).limit(problem_create.problem_cnt)
        
    elif problem_create.type == "random" and problem_create.incorrected_only_flg == True:
        query2 = select(Question).where(Question.is_correct == false()).order_by(func.random()).limit(problem_create.problem_cnt)

    elif problem_create.type == "category":
        query1 = select(CategoryQuestion.question_id).where(CategoryQuestion.category_id.in_(problem_create.category_ids))
        question_ids = db.execute(query1).scalars().all()        
        query2 = select(Question).where(Question.id.in_(question_ids)).limit(problem_create.problem_cnt)
    else:
        return '不明なものが入力されました。'
    return db.execute(query2).scalars().all()