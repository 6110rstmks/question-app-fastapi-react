from sqlalchemy.orm import Session
from schemas.problem import ProblemFetch, ProblemFetchByDate
from sqlalchemy import select, func
from models2 import Question, CategoryQuestion, SubcategoryQuestion
from sqlalchemy.sql.expression import false
from fastapi import HTTPException
from config import SolutionStatus
from datetime import datetime, timedelta

def generate_problems(db: Session, problem_fetch: ProblemFetch):

    # 15日前の日付を計算
    fifteen_days_ago = datetime.now() - timedelta(days=15)
    # five_days_ago = datetime.now() - timedelta(days=5)
    
    status_enum = getattr(SolutionStatus, problem_fetch.solved_status.capitalize())

    # 「ランダム」の場合
    if problem_fetch.type == "random":
        query2 = (
            select(Question)
            .where(
                Question.is_correct == status_enum,
                Question.last_answered_date < fifteen_days_ago
            )
            .order_by(func.random())
            .limit(problem_fetch.problem_count)
        )
        
        results = db.execute(query2).scalars().all()
        
        if not results:
        # 15日前に解答した問題がなければ、すべてのIncorrect問題から取得
            query2 = (
                select(Question)
                .where(
                    Question.is_correct == status_enum,
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

        query2 = (
            select(Question)
            .where(Question.id.in_(question_ids))
            .where(Question.is_correct == status_enum)
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

def generate_problems_by_day(db: Session, day: str):
    query = (
        select(Question)
        .where(Question.last_answered_date == day)
        .where(Question.is_correct == SolutionStatus.Incorrect)
        .order_by(func.random())
        .limit(5)
    )

    return db.execute(query).scalars().all()
    