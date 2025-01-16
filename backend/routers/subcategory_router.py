from typing import Annotated, Optional
from fastapi import APIRouter, Path, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from starlette import status
from cruds import auth_crud as auth_cruds
from schemas.subcategory import SubcategoryResponse, SubcategoryUpdate, SubcategoryCreate, SubcategoryResponseWithQuestionCount
from schemas.auth import DecodedToken
from database import get_db
from cruds import category_crud, subcategory_crud

DbDependency = Annotated[Session, Depends(get_db)]

UserDependency = Annotated[DecodedToken, Depends(auth_cruds.get_current_user)]

router = APIRouter(prefix="/subcategories", tags=["SubCategories"])

# tags は、FastAPIでAPIルーターやエンドポイントにメタデータを追加するために使用されるオプションの引数です。これにより、APIドキュメント（例えば、Swagger UI）においてAPIエンドポイントをカテゴリごとにグループ化することができます。

@router.post("/", response_model=SubcategoryResponse, status_code=status.HTTP_201_CREATED)
# async def create(db: DbDependency, category_id: int, subcategory_create: SubcategoryCreate):
async def create_subcategory(db: DbDependency, subcategory_create: SubcategoryCreate):
    found_category = category_crud.find_category_by_id(db, subcategory_create.category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    pass
    return subcategory_crud.create_subcategory(db, subcategory_create)

@router.get("", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(db: DbDependency):
    return subcategory_crud.find_subcategories_in_category(db)

@router.get("/question_id/{question_id}", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_subcategories_by_question_id(
    db: DbDependency,
    question_id: int = Path(gt=0)
):
    return subcategory_crud.find_subcategories_by_question_id(db, question_id)

@router.get("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def find_subcategory_by_id(
    db: DbDependency, 
    # user: UserDependency, 
    id: int = Path(gt=0),
):
    found_subcategory = subcategory_crud.find_subcategory_by_id(db, id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return found_subcategory

@router.get("/category_id/{category_id}", response_model=list[SubcategoryResponseWithQuestionCount], status_code=status.HTTP_200_OK)
async def find_subcategories_in_category(
    db: DbDependency, 
    category_id: int = Path(gt=0),
    limit: Optional[int] = None,
    searchSubcategoryWord: Optional[str] = None,
    searchQuestionWord: Optional[str] = None
):
    return subcategory_crud.find_subcategories_in_categorybox(db, category_id, limit, searchSubcategoryWord, searchQuestionWord)

@router.get("/", response_model=list[SubcategoryResponse], status_code=status.HTTP_200_OK)
async def find_by_name(
    db: DbDependency,
    name: str = Query(min_length=2, max_length=20)
):
    return subcategory_crud.find_subcategory_by_name(db, name)


@router.put("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def update(
    db: DbDependency,
    subcategory_update: SubcategoryUpdate,
    id: int = Path(gt=0),
):
    updated_item = subcategory_crud.update2(db, id, subcategory_update)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Subcategory not updated")
    return updated_item


@router.delete("/{id}", response_model=SubcategoryResponse, status_code=status.HTTP_200_OK)
async def delete_subcategory(
    db: DbDependency,
    id: int = Path(gt=0)
):
    deleted_item = subcategory_crud.delete_subcategory(db, id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not deleted")
    return deleted_item
