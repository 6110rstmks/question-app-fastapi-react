from sqlalchemy.orm import Session
from sqlalchemy import select, func
from models import Question, SubcategoryQuestion, CategoryQuestion
from datetime import date, timedelta
from config import SolutionStatus
from models import CategoryBlacklist
from schemas.question import  QuestionGetCountByIsCorrectInSubcategory, QuestionGetCountByIsCorrectInCategory

from src.repository.question_repository import QuestionRepository
from src.repository.category_question_repository import CategoryQuestionRepository
from src.repository.subcategory_question_repository import SubcategoryQuestionRepository

from database import SessionDependency


async def get_question_count_in_category(
    category_id: int,
    session=SessionDependency
) -> int:
    category_question_repository = CategoryQuestionRepository(session)
    question_repository = QuestionRepository(session)

    categories_questions = await category_question_repository.find_by_category_id(category_id)
    question_ids = [cq.question_id for cq in categories_questions]
    count = await question_repository.get_count_by_ids(question_ids)
    return int(count)

async def get_question_count_in_subcategory(
    subcategory_id: int,
    session=SessionDependency
) -> int:
    subcategory_question_repository = SubcategoryQuestionRepository(session)
    question_repository = QuestionRepository(session)
    
    subcategories_questions = await subcategory_question_repository.find_by_subcategory_id(subcategory_id)
    question_ids = [sq.question_id for sq in subcategories_questions]
    count = await question_repository.get_count_by_ids(question_ids)
    return int(count)


# カレンダーに表示する用。
def get_question_count_by_last_answered_date(
    db: Session,
    days_array: list[str]
) -> dict[str, int]:
    
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

def get_question_temporary_count(db: Session) -> int:
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

def get_question_temporary_count_in_subcategory(
    db: Session,
    subcategory_id: int
):
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(SubcategoryQuestion).
                    where(Question.is_correct == SolutionStatus.Temporary).
                    where(SubcategoryQuestion.subcategory_id == subcategory_id)
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


def get_question_count_by_is_correct_in_subcategory(
    db: Session,
    body: QuestionGetCountByIsCorrectInSubcategory,
) -> int:

    subcategory_id = body.subcategory_id
    is_correct = body.is_correct
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(SubcategoryQuestion).
                    where(SubcategoryQuestion.subcategory_id == subcategory_id).
                    where(Question.is_correct == is_correct)
                )
    return int(count)

def get_question_count_by_is_correct_in_category(
    db: Session,
    body: QuestionGetCountByIsCorrectInCategory,
) -> int:
    count = db.scalar(
                    select(func.count()).
                    select_from(Question).
                    join(CategoryQuestion).
                    where(CategoryQuestion.category_id == body.category_id).
                    where(Question.is_correct == body.is_correct)
                )
    return int(count)