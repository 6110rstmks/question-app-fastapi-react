from typing import Annotated
from fastapi import APIRouter, Path, HTTPException, Depends, FastAPI
from sqlalchemy.orm import Session
from starlette import status
from cruds import question_crud
from schemas.question import QuestionResponse, QuestionCreateSchema, QuestionIsCorrectUpdate, QuestionUpdateSchema, QuestionBelongsToSubcategoryIdUpdate, QuestionGetCountByLastAnsweredDate
from database import get_db, SessionDependency
from cruds import subcategory_crud as subcategory_cruds

from src.repository.category_repository import CategoryRepository
from src.repository.subcategory_repository import SubcategoryRepository
from src.repository.question_repository import QuestionRepository

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

# Questionを作成するエンドポイント
@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create(
    question_create: QuestionCreateSchema,
    session=SessionDependency, 
):
    category_repository = CategoryRepository(session)
    subcategory_repository = SubcategoryRepository(session)
    found_category = await category_repository.get(question_create.category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")

    found_subcategory = await subcategory_repository.get(question_create.subcategory_id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return await question_crud.create(question_create, session=session)

# Questionを更新するエンドポイント
@router.put("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def update(
    question_update: QuestionUpdateSchema,
    id: int = Path(gt=0),
    session=SessionDependency,
):
    updated_item = await question_crud.update_question(id, question_update, session)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item

@router.put("/increment_answer_count/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def increment_answer_count(
    id: int = Path(gt=0),
    session=SessionDependency,
):
    updated_item = await question_crud.increment_answer_count(id, session)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item

# Questionのlast_answered_dateを更新するエンドポイント
@router.put("/update_last_answered_date/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def update_last_answered_date(
    id: int = Path(gt=0),
    session=SessionDependency,
):
    updated_item = await question_crud.update_last_answered_date(id, session)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item

# Questionのcorrect_flgカラムを更新するエンドポイント
@router.put("/edit_flg/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def update_correct_flg(
    question_update: QuestionIsCorrectUpdate,
    id: int = Path(gt=0),
    session=SessionDependency
):
    updated_item = await question_crud.update_is_correct(id, question_update, session)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item

# Questionを全て取得するエンドポイント
@router.get("", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions(
    searchWord: str = None,
    session= SessionDependency,
):
    return await question_crud.find_all_questions(search_word=searchWord, session=session)

# Question IDからQuestionを取得するエンドポイント
@router.get("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def find_question_by_id(
    id: int = Path(gt=0),
    session=SessionDependency,
):
    question_repository = QuestionRepository(session)
    found_question = await question_repository.get(id)
    if not found_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return found_question

# Category IDに紐づくQuestionsを取得するエンドポイント
# このエンドポイントもしかして使用されていないかも。。。
# @router.get("/category_id/{category_id}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
# async def find_all_questions_in_category(
#     db: DbDependency, 
#     category_id: int = Path(gt=0)
# ):
#     found_category = category_crud.find_category_by_id(db, category_id)
#     # category_repository = CategoryRepository(db)
#     # found_category = await category_repository.get(category_id)
#     if not found_category:
#         raise HTTPException(status_code=404, detail="Category not found")
#     return question_crud.find_all_questions_in_category(db, category_id)

@router.get("/subcategory_id/{subcategory_id}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions_in_subcategory(
    subcategory_id: int = Path(gt=0),
    session=SessionDependency, 
):
    return await question_crud.find_all_questions_in_subcategory(subcategory_id, session=session)

# Questionを削除するエンドポイント
@router.delete("/{question_id}", response_model=None, status_code=status.HTTP_200_OK)
async def delete(
    question_id: int = Path(gt=0),
    session=SessionDependency,
):
    await question_crud.delete_question(question_id, session)
    return
