from sqlalchemy.orm import Session
from schemas.problem import ProblemFetch, ProblemFetchByDate
from sqlalchemy import select, func
from models2 import Question, CategoryQuestion, SubcategoryQuestion
from sqlalchemy.sql.expression import false

# 問題を出題する
def generate_problems(db: Session, problem_fetch: ProblemFetch):
    
    # 「ランダム」でかつ「全問題から出題」の場合
    if problem_fetch.type == "random" and problem_fetch.incorrected_only_flg == False:
        query2 = select(Question).order_by(func.random()).limit(problem_fetch.problem_cnt)
        
    # 「ランダム」でかつ「未正解のみ」の場合
    elif problem_fetch.type == "random" and problem_fetch.incorrected_only_flg == True:
        query2 = select(Question).where(Question.is_correct == false()).order_by(func.random()).limit(problem_fetch.problem_cnt)

        
    # 「カテゴリ」でかつ「全問題から出題」の場合
    elif problem_fetch.type == "category" and problem_fetch.incorrected_only_flg == False:
        query1 = select(CategoryQuestion.question_id).where(CategoryQuestion.category_id.in_(problem_fetch.category_ids))
        question_ids = db.execute(query1).scalars().all()        
        query2 = select(Question).where(Question.id.in_(question_ids)).limit(problem_fetch.problem_cnt)
        
    # 「カテゴリ」でかつ「未正解のみ」の場合
    elif problem_fetch.type == "category" and problem_fetch.incorrected_only_flg == True:
        query1 = select(CategoryQuestion.question_id).where(CategoryQuestion.category_id.in_(problem_fetch.category_ids))
        question_ids = db.execute(query1).scalars().all()
        query2 = select(Question).where(Question.id.in_(question_ids)).where(Question.is_correct == false()).order_by(func.random()).limit(problem_fetch.problem_cnt)
    
    elif problem_fetch.type == "subcategory" and problem_fetch.incorrected_only_flg == True:
        query1 = select(SubcategoryQuestion.question_id).where(SubcategoryQuestion.subcategory_id.in_(problem_fetch.subcategory_ids))
        question_ids = db.execute(query1).scalars().all()
        query2 = select(Question).where(Question.id.in_(question_ids)).where(Question.is_correct == false()).order_by(func.random()).limit(problem_fetch.problem_cnt)
    else:
        return '不明なものが入力されました。'
    return db.execute(query2).scalars().all()

def generate_problems_by_day(db: Session, problem_fetch_by_date: ProblemFetchByDate):
    query = select(Question).where(Question.last_answered_date == problem_fetch_by_date.date).order_by(func.random())
    return db.execute(query).scalars().all()
    