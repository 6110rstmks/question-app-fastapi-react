from typing import Annotated
from fastapi import APIRouter, Path, Query, HTTPException, Depends, FastAPI, Request
from sqlalchemy.orm import Session
from starlette import status
from cruds import category_crud, question_crud
from schemas.question import QuestionResponse, QuestionCreate, QuestionIsCorrectUpdate, QuestionUpdate, QuestionBelongsToSubcategoryIdUpdate
from schemas.category import CategoryResponse
from schemas.subcategory import SubcategoryResponse
from schemas.subcategory_question import SubcategoryQuestionResponse
# from schema.auth import DecodedToken
from database import get_db
from cruds import subcategory_crud as subcategory_cruds

DbDependency = Annotated[Session, Depends(get_db)]

# tags は、FastAPIでAPIルーターやエンドポイントにメタデータを追加するために使用されるオプションの引数です。これにより、APIドキュメント（例えば、Swagger UI）においてAPIエンドポイントをカテゴリごとにグループ化することができます。

router = APIRouter(prefix="/questions", tags=["Questions"])
app = FastAPI()

@router.put("/change_belongs_to_subcategoryId", response_model=list[int], status_code=status.HTTP_200_OK)
async def change_belongs_to_subcategoryId(
    db: DbDependency,
    changeSubcategoryUpdate: QuestionBelongsToSubcategoryIdUpdate
):
    return question_crud.change_belongs_to_subcategoryId(db, changeSubcategoryUpdate)

# Question数を取得するエンドポイント
@router.get("/count", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_count(db: DbDependency):
    return question_crud.get_question_count(db)

# 不正解のQuestion数を取得するエンドポイント
@router.get("/uncorrected_count", response_model=int, status_code=status.HTTP_200_OK)
async def get_question_uncorrected_count(db: DbDependency):
    return question_crud.get_question_uncorrected_count(db)

# Questionを作成するエンドポイント
@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create(
    db: DbDependency, 
    question_create: QuestionCreate
):
    found_category = category_crud.find_category_by_id(db, question_create.category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    found_subcategory = subcategory_cruds.find_subcategory_by_id(db, question_create.subcategory_id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="Category not found")
    return question_crud.create(db, question_create)
    
# Questionを更新するエンドポイント
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

@router.put("/increment_answer_count/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def increment_answer_count(
    db: DbDependency,
    id: int = Path(gt=0),
):
    updated_item = question_crud.increment_answer_count(db, id)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item

# Questionのcorrect_flgカラムを更新するエンドポイント
@router.put("/edit_flg/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def update_correct_flg(
    db: DbDependency,
    question_update: QuestionIsCorrectUpdate,
    id: int = Path(gt=0),
):
    updated_item = question_crud.update_is_correct(db, id, question_update)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item

# Questionを全て取得するエンドポイント
@router.get("", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions(
    db: DbDependency,
    searchProblemWord: str = None
    ):
    return question_crud.find_all_questions(db, search_problem_word=searchProblemWord)

# Question IDからQuestionを取得するエンドポイント
@router.get("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def find_question_by_id(db: DbDependency, id: int = Path(gt=0)):
    found_question = question_crud.find_question_by_id(db, id)
    if not found_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return found_question

# question_idからQuestionに紐づくCategoryを取得するエンドポイント
@router.get("/get_category/{question_id}", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
async def find_category_by_question_id(db: DbDependency, question_id: int = Path(gt=0)):
    found_category = question_crud.find_category_by_question_id(db, question_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return found_category

# Category IDに紐づくQuestionsを取得するエンドポイント
@router.get("/category_id/{category_id}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions_in_category(db: DbDependency, category_id: int = Path(gt=0)):
    return question_crud.find_all_questions_in_category(db, category_id)

@router.get("/subcategory_id/{subcategory_id}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions_in_subcategory(db: DbDependency, subcategory_id: int = Path(gt=0)):
    return question_crud.find_all_questions_in_subcategory(db, subcategory_id)


# Questionを削除するエンドポイント
@router.delete("/{question_id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def delete(
    db: DbDependency, question_id: int = Path(gt=0)
):
    # deleted_item = question_cruds.delete(db, id, user.user_id)
    deleted_item = question_crud.delete_question(db, question_id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not deleted")
    return deleted_item

