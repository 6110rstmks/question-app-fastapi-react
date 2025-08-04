from sqlalchemy.orm import Session
from schemas.problem import ProblemFetch
from sqlalchemy import select, func
from models import Question, CategoryQuestion, SubcategoryQuestion
from fastapi import HTTPException
from config import SolutionStatus
from datetime import datetime, timedelta
from models import CategoryBlacklist
from typing import Optional, List

def generate_problems(db: Session, problem_fetch: ProblemFetch)-> List[Question]:
    """
    Generate a list of questions
    """
    blacklist = _get_blacklisted_question_ids(db)
    threshold = _get_threshold(problem_fetch.solved_status)
    status_enum = getattr(SolutionStatus, problem_fetch.solved_status.capitalize())
    question_ids = _get_question_ids_by_type(db, problem_fetch)

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

def get_today_problems(db: Session) -> List[Question]:
    """
    Get today's problems that have been answered today.
    """
    today = datetime.now().date()
    blacklisted_question_ids = _get_blacklisted_question_ids(db)

    query = (
        select(Question)
        .where(
            Question.last_answered_date == today,
            Question.is_correct == SolutionStatus.Incorrect,
            Question.id.notin_(blacklisted_question_ids)
        )
        .order_by(func.random())
        .limit(5)
    )
    
    if not db.execute(query).scalars().all():
        # 明日の問題を取得
        tomorrow = today + timedelta(days=1)
        query = (
            select(Question)
            .where(
                Question.last_answered_date == tomorrow,
                Question.is_correct == SolutionStatus.Incorrect,
                Question.id.notin_(blacklisted_question_ids)
            )
            .order_by(func.random())
            .limit(5)
        )
    return db.execute(query).scalars().all()

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
        
    print(filters)
    print("doiu2987")
    print(threshold)
    print(blacklist)

    stmt = (
        select(Question)
        .where(*filters)
        .order_by(func.random())
        .limit(limit)
    )
    return db.execute(stmt).scalars().all()

    