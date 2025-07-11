from sqlalchemy.orm import Session
from schemas.problem import ProblemFetch
from sqlalchemy import select, func
from models import Question, CategoryQuestion, SubcategoryQuestion
from fastapi import HTTPException
from config import SolutionStatus
from datetime import datetime, timedelta
from models import CategoryBlacklist

# ブラックリストカテゴリの問題IDを取得
def get_blacklisted_question_ids(db: Session):
    blacklisted_category_ids = db.execute(
        select(CategoryBlacklist.category_id)
    ).scalars().all()

    if blacklisted_category_ids:
        blacklisted_question_ids = db.execute(
            select(CategoryQuestion.question_id)
            .where(CategoryQuestion.category_id.in_(blacklisted_category_ids))
        ).scalars().all()
    else:
        blacklisted_question_ids = []
        
    return blacklisted_question_ids

def generate_problems(db: Session, problem_fetch: ProblemFetch):
    
    # ブラックリストカテゴリの問題IDを取得
    blacklisted_question_ids = get_blacklisted_question_ids(db)

    # 15日前の日付を計算
    fifteen_days_ago = datetime.now() - timedelta(days=15)
    
    one_month_ago = datetime.now() - timedelta(days=30)
    
    status_enum = getattr(SolutionStatus, problem_fetch.solved_status.capitalize())

    print(status_enum)

    # 「ランダム」の場合
    if problem_fetch.type == "random":
        
        if problem_fetch.solved_status == "temporary":
            query2 = (
                select(Question)
                .where(
                    Question.is_correct == status_enum,
                    Question.last_answered_date < fifteen_days_ago,
                    Question.id.notin_(blacklisted_question_ids)
                )
                .order_by(func.random())
                .limit(problem_fetch.problem_count)
            )
            results = db.execute(query2).scalars().all()
        elif problem_fetch.solved_status == "correct":
            query2 = (
                select(Question)
                .where(
                    Question.is_correct == status_enum,
                    Question.last_answered_date < one_month_ago,
                    Question.id.notin_(blacklisted_question_ids)
                )
                .order_by(func.random())
                .limit(problem_fetch.problem_count)
            )
            results = db.execute(query2).scalars().all()
        else:
            results = None
        
        if not results:
        # 15日前に解答したTemporary問題もしくは30日前に解答したIncorrect問題がなければ、すべてのIncorrect問題から取得
            query2 = (
                select(Question)
                .where(
                    Question.is_correct == status_enum,
                    Question.id.notin_(blacklisted_question_ids)
                )
                .order_by(func.random())
                .limit(problem_fetch.problem_count)
            )            
        
    # 「カテゴリ」の場合
    elif problem_fetch.type == "category":
                
        query1 = (
            select(CategoryQuestion.question_id)
            .where(CategoryQuestion.category_id.in_(problem_fetch.category_ids))
        )
        
        question_ids = db.execute(query1).scalars().all()
            
        if problem_fetch.solved_status == "temporary":

            query2 = (
                select(Question)
                .where(Question.id.in_(question_ids))
                .where(
                    Question.is_correct == status_enum,
                    Question.last_answered_date < fifteen_days_ago,
                )
                .order_by(func.random())
                .limit(problem_fetch.problem_count)
            )
            results = db.execute(query2).scalars().all()
        elif problem_fetch.solved_status == "correct":
            query2 = (
                select(Question)
                .where(Question.id.in_(question_ids))
                .where(
                    Question.is_correct == status_enum,
                    Question.last_answered_date < one_month_ago,
                )
                .order_by(func.random())
                .limit(problem_fetch.problem_count)
            )
            results = db.execute(query2).scalars().all()
        else:
            results = None
            
        if not results:
            # 15日前に解答した問題がなければ、すべてのIncorrect問題から取得
            query2 = (
                select(Question)
                .where(Question.id.in_(question_ids))
                .where(
                    Question.is_correct == status_enum
                )
                .order_by(func.random())
                .limit(problem_fetch.problem_count)
            )
        
    # 「サブカテゴリ」の場合
    elif problem_fetch.type == "subcategory":
        query1 = (
            select(SubcategoryQuestion.question_id)
            .where(SubcategoryQuestion.subcategory_id.in_(problem_fetch.subcategory_ids))
        )
        
        question_ids = db.execute(query1).scalars().all()

        query2 = (
            select(Question)
            .where(Question.id.in_(question_ids))
            .where(Question.is_correct == status_enum)
            .order_by(func.random())
            .limit(problem_fetch.problem_count)
        )
    
    else:
        raise HTTPException(status_code=400, detail="不明なものが入力されました。")
        
    # クエリ結果が空の場合
    results = db.execute(query2).scalars().all()
    if not results:
        raise HTTPException(status_code=400, detail="出題する問題がありませんでした。")
    return results

# 可読性が低いため関数を分離する
def generate_problems_by_category():
    pass

def generate_problems_by_subcategory():
    pass

def generate_problems_by_random():
    pass

def generate_problems_by_day(db: Session, day: str):
    # ブラックリストカテゴリの問題IDを取得
    blacklisted_question_ids = get_blacklisted_question_ids(db)

    query = (
        select(Question)
        .where(Question.last_answered_date == day)
        .where(
            Question.is_correct == SolutionStatus.Incorrect,
            Question.id.notin_(blacklisted_question_ids)
        )
        .order_by(func.random())
        .limit(5)
    )

    return db.execute(query).scalars().all()
    