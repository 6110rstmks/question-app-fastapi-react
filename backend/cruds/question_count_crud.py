from sqlalchemy.orm import Session
from sqlalchemy import select, func
from models import Question, SubcategoryQuestion, CategoryQuestion
from datetime import date, timedelta
from config import SolutionStatus
from models import CategoryBlacklist

def get_question_count(db: Session):
    count = db.scalar(
                    select(func.count()).
                    select_from(Question)
                )
    
    return int(count)

def get_question_count_in_category(
    db: Session,
    category_id: int
):
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(CategoryQuestion).
                    where(CategoryQuestion.category_id == category_id)
                )
    return int(count)

def get_question_count_in_subcategory(
    db: Session,
    subcategory_id: int
):

    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(SubcategoryQuestion).
                    where(SubcategoryQuestion.subcategory_id == subcategory_id)
                )
    return int(count)

def get_question_count_by_last_answered_date(
    db: Session,
    days_array: list[str]
):
    
    # ブラックリストカテゴリの問題IDを取得
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
        
    return_days_count_array = {}
    
    for day in days_array:        
        count = db.scalar(
            select(func.count()).
            select_from(Question).
            where(Question.last_answered_date == day).
            where(Question.is_correct == SolutionStatus.Incorrect).
            where(Question.id.notin_(blacklisted_question_ids))
        )
        return_days_count_array[day] = int(count)

    return return_days_count_array


# ------------------------------------------------------------------------ #
# Corrected
# ------------------------------------------------------------------------ #

def get_question_corrected_count_in_category_older_than_x_days(
    db: Session,
    category_id: int,
    x_days: int
):
    # x_days前の日付を取得
    x_days_ago = date.today() - timedelta(days=x_days)
    
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(CategoryQuestion).
                    where(Question.is_correct == SolutionStatus.Correct).
                    where(CategoryQuestion.category_id == category_id).
                    where(Question.last_answered_date < x_days_ago)
                )
    return int(count)

# last_answered_dateが1ヶ月より前のの正解のQuestionの数を取得する。
def get_question_corrected_count_in_category_older_than_one_month(
    db: Session,
    category_id: int
):
    one_month_ago = date.today().replace(day=1)  # 1ヶ月前の日付を取得
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(CategoryQuestion).
                    where(Question.is_correct == SolutionStatus.Correct).
                    where(CategoryQuestion.category_id == category_id).
                    where(Question.last_answered_date < one_month_ago)
                )
    print("count", count)
    return int(count)

def get_question_corrected_count(db: Session):
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    where(Question.is_correct == SolutionStatus.Correct)
                )
    return int(count)


# ------------------------------------------------------------------------ #
# Temporary
# ------------------------------------------------------------------------ #

def get_question_temporary_count(db: Session):
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    where(Question.is_correct == SolutionStatus.Temporary)
                )
    return int(count)

def get_question_temporary_count_in_category_older_than_x_days(
    db: Session,
    category_id: int,
    x_days: int
):
    # x_days前の日付を取得
    x_days_ago = date.today() - timedelta(days=x_days)
    
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(CategoryQuestion).
                    where(Question.is_correct == SolutionStatus.Temporary).
                    where(CategoryQuestion.category_id == category_id).
                    where(Question.last_answered_date < x_days_ago)
                )
    return int(count)


# ------------------------------------------------------------------------ #
# Uncorrected
# ------------------------------------------------------------------------ #

def get_question_uncorrected_count(db: Session):
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    where(Question.is_correct == SolutionStatus.Incorrect)
                )
    return int(count)

def get_question_uncorrected_count_in_category(
    db: Session,
    category_id: int
):
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(CategoryQuestion).
                    where(Question.is_correct == SolutionStatus.Incorrect).
                    where(CategoryQuestion.category_id == category_id)
                )
    return int(count)


def get_question_uncorrected_count_in_subcategory(
    db: Session,
    subcategory_id: int
):

    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(SubcategoryQuestion).
                    where(Question.is_correct == SolutionStatus.Incorrect).
                    where(SubcategoryQuestion.subcategory_id == subcategory_id)
                )
    return int(count)

