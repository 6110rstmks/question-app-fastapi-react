from sqlalchemy.orm import Session
from schemas.problem import ProblemCreate
from sqlalchemy import select, func
from models2 import Question, CategoryQuestion
from sqlalchemy.sql.expression import false
import random

# 問題を出題する
def generate_problems(db: Session, problem_create: ProblemCreate):
    
    # 「ランダム」でかつ「全問題」の場合
    if problem_create.type == "random" and problem_create.incorrected_only_flg == False:
        query2 = select(Question).order_by(func.random()).limit(problem_create.problem_cnt)
        
    # 「ランダム」でかつ「未正解のみ」の場合
    elif problem_create.type == "random" and problem_create.incorrected_only_flg == True:
        query2 = select(Question).where(Question.is_correct == false()).order_by(func.random()).limit(problem_create.problem_cnt)

        
    elif problem_create.type == "category" and problem_create.incorrected_only_flg == False:
        query1 = select(CategoryQuestion.question_id).where(CategoryQuestion.category_id.in_(problem_create.category_ids))
        question_ids = db.execute(query1).scalars().all()        
        query2 = select(Question).where(Question.id.in_(question_ids)).limit(problem_create.problem_cnt)
        
    elif problem_create.type == "category" and problem_create.incorrected_only_flg == True:
        query1 = select(CategoryQuestion.question_id).where(CategoryQuestion.category_id.in_(problem_create.category_ids))
        question_ids = db.execute(query1).scalars().all()
        query2 = select(Question).where(Question.id.in_(question_ids)).where(Question.is_correct == false()).order_by(func.random()).limit(problem_create.problem_cnt)
    else:
        return '不明なものが入力されました。'
    return db.execute(query2).scalars().all()