from typing import Optional
from fastapi import APIRouter, Path, Query, HTTPException, Depends

from starlette import status


from schemas.subcategory import SubcategoryResponse, SubcategoryUpdateSchema, SubcategoryCreateSchema
from cruds import subcategory_crud, category_crud
from database import SessionDependency


from src.repository.subcategory_repository import SubcategoryRepository, SubcategoryUpdate, SubcategoryCreate
from src.repository.subcategory_question_repository import SubcategoryQuestionRepository


router = APIRouter(prefix="/subcategories", tags=["SubCategories"])

@router.post("/", response_model=SubcategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_subcategory(
    subcategory_create: SubcategoryCreateSchema,
    session=SessionDependency
):
    found_category = await category_crud.find_category_by_id(subcategory_create.category_id, session)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")

    subcategory_repository = SubcategoryRepository(session)
    new_subcategory = await subcategory_repository.create(SubcategoryCreate(name=subcategory_create.name, category_id=subcategory_create.category_id))
    return SubcategoryResponse.model_validate(new_subcategory, from_attributes=True)


# question_idからQuestionに紐づくSubcategoryを取得するエンドポイント
@router.get("/question_id/{question_id}", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_subcategories_by_question_id(
    question_id: int = Path(gt=0),
    session=SessionDependency
):
    subcategory_repository = SubcategoryRepository(session)
    subcategory_question_repository = SubcategoryQuestionRepository(session)

    subcategory_ids_and_question_ids = await subcategory_question_repository.find_by_question_id(question_id)
    subcategory_ids = [subcategory_id_and_question_id.subcategory_id for subcategory_id_and_question_id in subcategory_ids_and_question_ids]
    return await subcategory_repository.find_by_ids(subcategory_ids)


@router.get("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def find_subcategory_by_id(
    id: int = Path(gt=0),
    session=SessionDependency, 
):
    subcategory_repository = SubcategoryRepository(session)
    found_subcategory = await subcategory_repository.get(id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return found_subcategory


@router.get("/", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_by_name(
    name: str = Query(min_length=2, max_length=20),
    session=SessionDependency
):
    subcategory_repository = SubcategoryRepository(session)
    return await subcategory_repository.find_by_name_contains(name)

@router.get("/category_id/{category_id}", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_by_category_id(
    category_id: int = Path(gt=0),
    searchSubcategoryName: Optional[str] = Query(default=None, min_length=2, max_length=20),
    session=SessionDependency
):
    subcategories = await subcategory_crud.find_subcategories_by_category_id(category_id, searchSubcategoryName, session)
    if not subcategories:
        return []
    return subcategories


@router.put("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def update(
    subcategory_update: SubcategoryUpdateSchema,
    session=SessionDependency,
    id: int = Path(gt=0),
):
    subcategory_repository = SubcategoryRepository(session)
    return await subcategory_repository.update(id, SubcategoryUpdate(name=subcategory_update.name))



@router.delete("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def delete_subcategory(
    id: int = Path(gt=0),
    session=SessionDependency
):
    deleted_item = await subcategory_crud.delete_subcategory(id, session)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Subcategory not deleted")
    return deleted_item
