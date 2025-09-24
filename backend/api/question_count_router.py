from typing import Annotated, Dict
from fastapi import APIRouter, Path, HTTPException, Depends, FastAPI
from sqlalchemy.orm import Session
from starlette import status
from cruds import category_crud, question_count_crud, subcategory_crud
from schemas.question import QuestionGetCountByLastAnsweredDate, QuestionGetCountByIsCorrectInSubcategory
from database import get_db

DbDependency = Annotated[Session, Depends(get_db)]

# tags は、FastAPIでAPIルーターやエンドポイントにメタデータを追加するために使用されるオプションの引数です。これにより、APIドキュメント（例えば、Swagger UI）においてAPIエンドポイントをカテゴリごとにグループ化することができます。

router = APIRouter(prefix="/question_count", tags=["Question Count"])
app = FastAPI()

# Question数を取得するエンドポイント
@router.get("/count", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_count(db: DbDependency):
    return question_count_crud.get_question_count(db)

# カテゴリ内のQuestion数を取得するエンドポイント
@router.get("/count/category_id/{category_id}", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_count_in_category(
    db: DbDependency,
    category_id: int = Path(gt=0)
):  
    found_category = category_crud.find_category_by_id(db, category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return question_count_crud.get_question_count_in_category(db, category_id)

# サブカテゴリ内のQuestion数を取得するエンドポイント
@router.get("/count/subcategory_id/{subcategory_id}", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_count_in_subcategory(
    db: DbDependency,
    subcategory_id: int = Path(gt=0)
):
    found_subcategory = subcategory_crud.find_subcategory_by_id(db, subcategory_id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    
    return question_count_crud.get_question_count_in_subcategory(db, subcategory_id)

# 最終回答日時ごとのQuestion数を取得するエンドポイント
@router.post("/count/by_last_answered_date", response_model=Dict[str, int], status_code=status.HTTP_200_OK)
async def get_question_count_by_last_answered_date(
    db: DbDependency,
    question_get_count_by_answered_date: QuestionGetCountByLastAnsweredDate
):
    return question_count_crud.get_question_count_by_last_answered_date(db, question_get_count_by_answered_date.days_array)

# ------------------------------------------------------------------------ #
# Corrected
# ------------------------------------------------------------------------ #

# 正解のQuestion数を取得するエンドポイント
@router.get("/count/corrected/", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_corrected_count(db: DbDependency):
    return question_count_crud.get_question_corrected_count(db)

@router.get("/count/corrected/category_id/${category_id}/order_than_x_days/${x_days}", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_corrected_count_in_category_order_than_x_days(
    db: DbDependency,
    category_id: int = Path(gt=0),
    x_days: int = Path(gt=0)
):
    found_category = category_crud.find_category_by_id(db, category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return question_count_crud.get_question_corrected_count_in_category_older_than_x_days(db, category_id, x_days)

# 特定のカテゴリ内の正解のQuestion数を取得するエンドポイント
@router.get("/count/corrected/category_id/{category_id}/order_than_one_month", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_corrected_count_in_category_order_than_one_month(
    db: DbDependency,
    category_id: int = Path(gt=0)
):
    found_category = category_crud.find_category_by_id(db, category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return question_count_crud.get_question_corrected_count_in_category_older_than_one_month(db, category_id)

# ------------------------------------------------------------------------ #
# Temporary
# ------------------------------------------------------------------------ #

@router.get("/count/temporary/", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_temporary_count(
    db: DbDependency
):
    return question_count_crud.get_question_temporary_count(db)

@router.get("/count/temporary/category_id/{category_id}/order_than_x_days/{x_days}", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_corrected_count_in_category_order_than_x_days(
    db: DbDependency,
    category_id: int = Path(gt=0),
    x_days: int = Path(gt=0)
):
    found_category = category_crud.find_category_by_id(db, category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return question_count_crud.get_question_temporary_count_in_category_older_than_x_days(db, category_id, x_days)


# @router.get("/count/temporary/subcategory_id/{subcategory_id}", response_model=int, status_code=status.HTTP_200_OK)
# async def get_question_temporary_count_in_subcategory(
#     db: DbDependency, 
#     subcategory_id: int = Path(gt=0)
# ):
#     return question_count_crud.get_question_temporary_count_in_subcategory(db, subcategory_id)

# ------------------------------------------------------------------------ #
# Uncorrected
# ------------------------------------------------------------------------ #

# 不正解のQuestion数を取得するエンドポイント
@router.get("/count/uncorrected/", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_uncorrected_count(db: DbDependency):
    return question_count_crud.get_question_uncorrected_count(db)

# 特定のカテゴリ内の不正解のQuestion数を取得するエンドポイント
@router.get("/count/uncorrected/category_id/{category_id}", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_uncorrected_count_in_category(
    db: DbDependency,
    category_id: int = Path(gt=0)
):
    found_category = category_crud.find_category_by_id(db, category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return question_count_crud.get_question_uncorrected_count_in_category(db, category_id)

# Subcategoryに紐づくQuestion数を取得するエンドポイント
# @router.get("/count/uncorrected/subcategory_id/{subcategory_id}", response_model=int, status_code=status.HTTP_200_OK)
# async def get_question_uncorrected_count_in_subcategory(
#     db: DbDependency, 
#     subcategory_id: int = Path(gt=0)
# ):
#     return question_count_crud.get_question_uncorrected_count_in_subcategory(db, subcategory_id)


# ======================================================================= #

@router.post("/count/is_correct/subcategory_id/", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_count_by_is_correct_in_subcategory(
    db: DbDependency,
    body: QuestionGetCountByIsCorrectInSubcategory,
):
    return question_count_crud.get_question_count_by_is_correct_in_subcategory(db, body)