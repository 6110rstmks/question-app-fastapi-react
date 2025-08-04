from sqlalchemy.orm import Session
from schemas.problem import ProblemFetch
from sqlalchemy import select, func
from models import Question, CategoryQuestion, SubcategoryQuestion
from fastapi import HTTPException
from config import SolutionStatus
from datetime import datetime, timedelta
from models import CategoryBlacklist
from typing import Optional, List

def _get_blacklisted_question_ids(db: Session)-> List[int]:
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

def _get_threshold(solved_status: str) -> Optional[datetime]:
    now = datetime.now()
    if solved_status == "temporary":
        return now - timedelta(days=15)
    elif solved_status == "correct":
        return now - timedelta(days=30)
    return None

def generate_problems(db: Session, problem_fetch: ProblemFetch)-> List[Question]:
    """
    Generate a list of questions
    """
    blacklist = _get_blacklisted_question_ids(db)
    threshold = _get_threshold(problem_fetch.solved_status)
    status_enum = getattr(SolutionStatus, problem_fetch.solved_status.capitalize())
    question_ids = _get_question_ids_by_type(db, problem_fetch)


    # # 「ランダム」の場合
    # if problem_fetch.type == "random":
        
    #     if problem_fetch.solved_status == "temporary":
    #         query2 = (
    #             select(Question)
    #             .where(
    #                 Question.is_correct == status_enum,
    #                 Question.last_answered_date < fifteen_days_ago,
    #                 Question.id.notin_(blacklisted_question_ids)
    #             )
    #             .order_by(func.random())
    #             .limit(problem_fetch.problem_count)
    #         )
    #         results = db.execute(query2).scalars().all()
    #     elif problem_fetch.solved_status == "correct":
    #         query2 = (
    #             select(Question)
    #             .where(
    #                 Question.is_correct == status_enum,
    #                 Question.last_answered_date < one_month_ago,
    #                 Question.id.notin_(blacklisted_question_ids)
    #             )
    #             .order_by(func.random())
    #             .limit(problem_fetch.problem_count)
    #         )
    #         results = db.execute(query2).scalars().all()
    #     else:
    #         results = None
        
    #     if not results:
    #     # 15日前に解答したTemporary問題もしくは30日前に解答したIncorrect問題がなければ、すべてのIncorrect問題から取得
    #         query2 = (
    #             select(Question)
    #             .where(
    #                 Question.is_correct == status_enum,
    #                 Question.id.notin_(blacklisted_question_ids)
    #             )
    #             .order_by(func.random())
    #             .limit(problem_fetch.problem_count)
    #         )            
        
    # # 「カテゴリ」の場合
    # elif problem_fetch.type == "category":
                
    #     query1 = (
    #         select(CategoryQuestion.question_id)
    #         .where(CategoryQuestion.category_id.in_(problem_fetch.category_ids))
    #     )
        
    #     question_ids = db.execute(query1).scalars().all()
            
    #     if problem_fetch.solved_status == "temporary":

    #         query2 = (
    #             select(Question)
    #             .where(Question.id.in_(question_ids))
    #             .where(
    #                 Question.is_correct == status_enum,
    #                 Question.last_answered_date < fifteen_days_ago,
    #             )
    #             .order_by(func.random())
    #             .limit(problem_fetch.problem_count)
    #         )
    #         results = db.execute(query2).scalars().all()
    #     elif problem_fetch.solved_status == "correct":
    #         query2 = (
    #             select(Question)
    #             .where(Question.id.in_(question_ids))
    #             .where(
    #                 Question.is_correct == status_enum,
    #                 Question.last_answered_date < one_month_ago,
    #             )
    #             .order_by(func.random())
    #             .limit(problem_fetch.problem_count)
    #         )
    #         results = db.execute(query2).scalars().all()
    #     else:
    #         results = None
            
    #     if not results:
    #         # 15日前に解答した問題がなければ、すべてのIncorrect問題から取得
    #         query2 = (
    #             select(Question)
    #             .where(Question.id.in_(question_ids))
    #             .where(
    #                 Question.is_correct == status_enum
    #             )
    #             .order_by(func.random())
    #             .limit(problem_fetch.problem_count)
    #         )
        
    # # 「サブカテゴリ」の場合
    # elif problem_fetch.type == "subcategory":
    #     query1 = (
    #         select(SubcategoryQuestion.question_id)
    #         .where(SubcategoryQuestion.subcategory_id.in_(problem_fetch.subcategory_ids))
    #     )
        
    #     question_ids = db.execute(query1).scalars().all()

    #     query2 = (
    #         select(Question)
    #         .where(Question.id.in_(question_ids))
    #         .where(Question.is_correct == status_enum)
    #         .order_by(func.random())
    #         .limit(problem_fetch.problem_count)
    #     )
    
    # else:
    #     raise HTTPException(status_code=400, detail="不明なものが入力されました。")
        
    # クエリ結果が空の場合
    # results = db.execute(query2).scalars().all()

    # 初回取得: 日付閾値あり
    results = _fetch_questions(
        db,
        question_ids,
        status_enum,
        threshold,
        blacklist,
        problem_fetch.problem_count,
    )

    # フォールバック: 閾値条件なし
    if not results:
        results = _fetch_questions(
            db,
            question_ids,
            status_enum,
            threshold=None,
            blacklist=blacklist,
            limit=problem_fetch.problem_count,
        )

    if not results:
        raise HTTPException(status_code=400, detail="出題する問題がありませんでした。")
    return results

def _get_question_ids_by_type(db: Session, fetch: ProblemFetch) -> Optional[List[int]]:
    """
    Return a list of question IDs based on the fetch type.
    None means 'random' (no filtering by ID list).
    """
    if fetch.type == "random":
        return None
    if fetch.type == "category":
        stmt = select(CategoryQuestion.question_id).where(
            CategoryQuestion.category_id.in_(fetch.category_ids)
        )
    elif fetch.type == "subcategory":
        stmt = select(SubcategoryQuestion.question_id).where(
            SubcategoryQuestion.subcategory_id.in_(fetch.subcategory_ids)
        )
    else:
        raise HTTPException(status_code=400, detail="不明なタイプが入力されました。")
    return db.execute(stmt).scalars().all()

def _fetch_questions(
    db: Session,
    question_ids: Optional[List[int]],
    status_enum,
    threshold: Optional[datetime],
    blacklist: List[int],
    limit: int,
) -> List[Question]:
    """
    Build and execute the query to fetch questions with optional filters:
    - question_ids: filter by specific IDs if provided
    - status_enum: filter by correctness status
    - threshold: filter by last_answered_date if provided
    - blacklist: exclude these question IDs
    """
    filters = [Question.is_correct == status_enum]
    if question_ids is not None:
        filters.append(Question.id.in_(question_ids))
    if threshold:
        filters.append(Question.last_answered_date < threshold)
    if blacklist:
        filters.append(Question.id.notin_(blacklist))
        
    print(threshold)
    print(blacklist)

    stmt = (
        select(Question)
        .where(*filters)
        .order_by(func.random())
        .limit(limit)
    )
    return db.execute(stmt).scalars().all()


def generate_problems_by_day(db: Session, day: str):
    # ブラックリストカテゴリの問題IDを取得
    blacklisted_question_ids = _get_blacklisted_question_ids(db)

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
    