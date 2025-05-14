from sqlalchemy.orm import Session
from schemas.problem import ProblemFetch, ProblemFetchByDate
from sqlalchemy import select, func
from models2 import Question, CategoryQuestion, SubcategoryQuestion
from sqlalchemy.sql.expression import false
from fastapi import HTTPException
from enum import Enum

class SolutionStatus(str, Enum):
    Incorrect = "Incorrect"
    Temporary = "Temporary"
    Correct = "Correct"

def generate_problems(db: Session, problem_fetch: ProblemFetch):

    all_status = ['incorrect', 'temporary', 'correct']
    print(problem_fetch.solved_status)

    # 「ランダム」でかつ「全問題から出題」の場合
    if problem_fetch.type == "random" and all(status in problem_fetch.solved_status for status in all_status):
        query2 = select(Question).order_by(func.random()).limit(problem_fetch.problem_cnt)
        
    # 「ランダム」でかつ「未正解のみ」の場合
    elif problem_fetch.type == "random" and 'incorrect' in problem_fetch.solved_status:
        query2 = (
            select(Question)
            .where(Question.is_correct == SolutionStatus.Incorrect)
            .order_by(func.random())
            .limit(problem_fetch.problem_cnt)
        )
        
        
    # 「カテゴリ」でかつ「全問題から出題」の場合
    elif problem_fetch.type == "category" and all_status in problem_fetch.solved_status:
        query1 = select(CategoryQuestion.question_id).where(CategoryQuestion.category_id.in_(problem_fetch.category_ids))
        question_ids = db.execute(query1).scalars().all()
        query2 = select(Question).where(Question.id.in_(question_ids)).limit(problem_fetch.problem_cnt)
        
    # 「カテゴリ」でかつ「未正解のみ」の場合
    elif problem_fetch.type == "category" and 'incorrect' in problem_fetch.solved_status:
        query1 = select(CategoryQuestion.question_id).where(CategoryQuestion.category_id.in_(problem_fetch.category_ids))
        question_ids = db.execute(query1).scalars().all()
        query2 = (
            select(Question)
            .where(Question.id.in_(question_ids))
            .where(Question.is_correct == SolutionStatus.Incorrect)
            .order_by(func.random())
            .limit(problem_fetch.problem_cnt)
        )
    
    # 「カテゴリ」でかつ「temporaryのみ」の場合
    elif problem_fetch.type == "category" and 'temporary' in problem_fetch.solved_status:
        query1 = select(CategoryQuestion.question_id).where(CategoryQuestion.category_id.in_(problem_fetch.category_ids))
        question_ids = db.execute(query1).scalars().all()
        query2 = (
            select(Question)
            .where(Question.id.in_(question_ids))
            .where(Question.is_correct == SolutionStatus.Temporary)
            .order_by(func.random())
            .limit(problem_fetch.problem_cnt)
        )

    # 「サブカテゴリ」でかつ「未正解のみ」の場合
    elif problem_fetch.type == "subcategory" and 'incorrect' in problem_fetch.solved_status:
        query1 = (
            select(SubcategoryQuestion.question_id)
            .where(SubcategoryQuestion.subcategory_id.in_(problem_fetch.subcategory_ids))
        )
        question_ids = db.execute(query1).scalars().all()
        query2 = (
            select(Question)
            .where(Question.id.in_(question_ids))
            .where(Question.is_correct == SolutionStatus.Incorrect)
            .order_by(func.random())
            .limit(problem_fetch.problem_cnt)
        )
        
    # 「サブカテゴリ」でかつ「temporaryのみ」の場合
    elif problem_fetch.type == "subcategory" and 'temporary' in problem_fetch.solved_status:
        query1 = (
            select(SubcategoryQuestion.question_id)
            .where(SubcategoryQuestion.subcategory_id.in_(problem_fetch.subcategory_ids))
        )
        question_ids = db.execute(query1).scalars().all()
        query2 = (
            select(Question)
            .where(Question.id.in_(question_ids))
            .where(Question.is_correct == SolutionStatus.Temporary)
            .order_by(func.random())
            .limit(problem_fetch.problem_cnt)
        )
    else:
        raise HTTPException(status_code=400, detail="不明なものが入力されました。")
    
    print(db.execute(query2).scalars().all())
    
    # クエリ結果が空の場合
    results = db.execute(query2).scalars().all()
    if not results:
        raise HTTPException(status_code=400, detail="出題する問題がありませんでした。")
    return results

def generate_problems_by_day(db: Session, day: str):
    query = (
        select(Question).
        where(Question.last_answered_date == day).
        where(Question.is_correct == SolutionStatus.Incorrect).
        order_by(func.random()).
        limit(5)
    )

    return db.execute(query).scalars().all()
    