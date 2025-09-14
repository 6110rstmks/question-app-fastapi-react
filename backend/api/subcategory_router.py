from typing import Annotated, Optional
from fastapi import APIRouter, Path, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status


from schemas.subcategory import SubcategoryResponse, SubcategoryUpdateSchema, SubcategoryResponseWithQuestionCount, SubcategoryWithCategoryNameResponse, SubcategoryCreateSchema
from database import get_db, get_session
from cruds import subcategory_crud, category_crud


from src.repository.subcategory_repository import SubcategoryRepository, SubcategoryCreate, SubcategoryUpdate
from src.repository.subcategory_question_repository import SubcategoryQuestionRepository
from src.repository.question_repository import QuestionRepository


DbDependency = Annotated[Session, Depends(get_db)]
AsyncDbDependency = Annotated[AsyncSession, Depends(get_session)]

router = APIRouter(prefix="/subcategories", tags=["SubCategories"])

@router.post("/", response_model=SubcategoryResponse, status_code=status.HTTP_201_CREATED)
# async def create_subcategory(db: DbDependency, subcategory_create: SubcategoryCreateSchema):
async def create_subcategory(db: AsyncDbDependency, subcategory_create: SubcategoryCreateSchema):
    # found_category = category_crud.find_category_by_id(db, subcategory_create.category_id)
    found_category = await category_crud.find_category_by_id(db, subcategory_create.category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")

    new_subcategory = await subcategory_crud.create_subcategory(db, subcategory_create)
    return SubcategoryResponse.model_validate(new_subcategory, from_attributes=True)

#
# @router.get("", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
# async def find_all(db: DbDependency):
#     return subcategory_crud.find_subcategories_in_categorybox(db)

# question_idからQuestionに紐づくSubcategoryを取得するエンドポイント
@router.get("/question_id/{question_id}", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_subcategories_by_question_id(
    db: AsyncDbDependency,
    question_id: int = Path(gt=0)
):
    subcategory_question_repository = SubcategoryQuestionRepository(db)
    subcategory_ids_and_question_ids = await subcategory_question_repository.find_by_question_id(question_id)
    subcategory_ids = [subcategory_id_and_question_id.subcategory_id for subcategory_id_and_question_id in subcategory_ids_and_question_ids]
    subcategory_repository = SubcategoryRepository(db)
    return await subcategory_repository.find_by_ids(subcategory_ids)


# @router.get("/WithCategoryName/category_id/{category_id}", response_model=list[SubcategoryWithCategoryNameResponse], status_code=status.HTTP_200_OK)
# async def find_subcategories_with_category_name_by_category_id(
#     db: DbDependency,
#     category_id: int = Path(gt=0)
# ):
#     return subcategory_crud.find_subcategories_with_category_name_by_category_id(db, category_id)

# @router.get("/WithCategoryName/id/{subcategory_id}", response_model=SubcategoryWithCategoryNameResponse, status_code=status.HTTP_200_OK)
# async def find_subcategories_with_category_name_by_id(
#     db: DbDependency,
#     subcategory_id: int = Path(gt=0)
# ):
#     return subcategory_crud.find_subcategories_with_category_name_by_id(db, subcategory_id)

@router.get("/WithCategoryName/question_id/{question_id}", response_model=list[SubcategoryWithCategoryNameResponse], status_code=status.HTTP_200_OK)
async def find_subcategories_with_category_name_by_question_id(
    db: DbDependency,
    question_id: int = Path(gt=0)
):
    return subcategory_crud.find_subcategories_with_category_name_by_question_id(db, question_id)


@router.get("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def find_subcategory_by_id(
    db: AsyncDbDependency, 
    id: int = Path(gt=0),
):
    found_subcategory = await subcategory_crud.find_subcategory_by_id(db, id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return found_subcategory

@router.get("/WithQuestionCount/category_id/{category_id}", response_model=list[SubcategoryResponseWithQuestionCount], status_code=status.HTTP_200_OK)
async def find_subcategories_with_question_count_in_category(
    db: AsyncDbDependency, 
    category_id: int = Path(gt=0),
    limit: Optional[int] = None,
    searchSubcategoryWord: Optional[str] = None,
    searchQuestionWord: Optional[str] = None,
    searchAnswerWord: Optional[str] = None
):
    return await subcategory_crud.find_subcategories_in_categorybox(db, category_id, limit, searchSubcategoryWord, searchQuestionWord, searchAnswerWord)

@router.get("/", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_by_name(
    db: AsyncDbDependency,
    name: str = Query(min_length=2, max_length=20)
):
    return await subcategory_crud.find_subcategory_by_name(db, name)

@router.get("/category_id/{category_id}", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_by_category_id(
    db: AsyncDbDependency,
    category_id: int = Path(gt=0)
):
    return await subcategory_crud.find_subcategories_by_category_id(db, category_id)

@router.put("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def update(
    db: AsyncDbDependency,
    subcategory_update: SubcategoryUpdateSchema,
    id: int = Path(gt=0),
):
    subcategory = await find_subcategory_by_id(db, id)
    if subcategory is None:
        raise HTTPException(status_code=404, detail="Subcategory not found")

    subcategory_repository = SubcategoryRepository(db)
    return await subcategory_repository.update(id, SubcategoryUpdate(name=subcategory_update.name))



@router.delete("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def delete_subcategory(
    db: AsyncDbDependency,
    id: int = Path(gt=0)
):
    deleted_item = await subcategory_crud.delete_subcategory(db, id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Subcategory not deleted")
    return deleted_item
