from typing import Annotated
from fastapi import APIRouter, Path, Query, HTTPException, Depends, FastAPI, Request
from sqlalchemy.orm import Session
from starlette import status
from cruds import category_crud, question_crud
from schemas.question import QuestionResponse, QuestionCreate, QuestionIsCorrectUpdate, QuestionUpdate
from schemas.problem import ProblemCreate
# from schemaa.auth import DecodedToken
from database import get_db
from cruds import subcategory_crud as subcategory_cruds
from fastapi.responses import JSONResponse

DbDependency = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/questions", tags=["Questions"])
app = FastAPI()

# tags は、FastAPIでAPIルーターやエンドポイントにメタデータを追加するために使用されるオプションの引数です。これにより、APIドキュメント（例えば、Swagger UI）においてAPIエンドポイントをカテゴリごとにグループ化することができます。

# 問題を作成する。
@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create(db: DbDependency, question_create: QuestionCreate):
    found_category = category_crud.find_by_id(db, question_create.category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    found_subcategory = subcategory_cruds.find_by_id(db, question_create.subcategory_id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="Category not found")
    return question_crud.create(db, question_create)


        

    
@router.put("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def update(
    db: DbDependency,
    question_update: QuestionUpdate,
    id: int = Path(gt=0),
):
    updated_item = question_crud.update2(db, id, question_update)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item

@router.put("/edit_flg/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def update_correct_flg(
    db: DbDependency,
    question_update: QuestionIsCorrectUpdate,
    id: int = Path(gt=0),
):
    updated_item = question_crud.update_correct_flg(db, id, question_update)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item

@router.get("", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all(db: DbDependency):
    return question_crud.find_all(db)


@router.get("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def find_by_id(db: DbDependency, id: int = Path(gt=0)):
    found_question = question_crud.find_by_id(db, id)
    if not found_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return found_question

@router.get("/category_id/{category_id}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions_in_category(db: DbDependency, category_id: int = Path(gt=0)):
    return question_crud.find_all_questions_in_category(db, category_id)

@router.get("/subcategory_id/{subcategory_id}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions_in_subcategory(db: DbDependency, subcategory_id: int = Path(gt=0)):
    return question_crud.find_all_questions_in_subcategory(db, subcategory_id)

@router.get("/", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_by_name(
    db: DbDependency, name: str = Query(min_length=2, max_length=20)
):
    return question_crud.find_by_name(db, name)

@router.delete("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def delete(db: DbDependency, id: int = Path(gt=0)):
    # deleted_item = question_cruds.delete(db, id, user.user_id)
    deleted_item = question_crud.delete(db, id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not deleted")
    return deleted_item