from typing import Annotated, Optional
from fastapi import APIRouter, Path, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from starlette import status
from cruds import auth as auth_cruds
from schemas.subcategory import SubCategoryResponse, SubCategoryUpdate, SubCategoryCreate
from schemas.auth import DecodedToken
from database import get_db
from cruds import category_crud, subcategory_crud

DbDependency = Annotated[Session, Depends(get_db)]

UserDependency = Annotated[DecodedToken, Depends(auth_cruds.get_current_user)]

router = APIRouter(prefix="/subcategories", tags=["SubCategories"])

# tags は、FastAPIでAPIルーターやエンドポイントにメタデータを追加するために使用されるオプションの引数です。これにより、APIドキュメント（例えば、Swagger UI）においてAPIエンドポイントをカテゴリごとにグループ化することができます。

@router.get("", response_model=list[SubCategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(db: DbDependency):
    return subcategory_crud.find_all(db)

@router.get("/{id}", response_model=SubCategoryResponse, status_code=status.HTTP_200_OK)
async def find_by_id(
    db: DbDependency, 
    # user: UserDependency, 
    id: int = Path(gt=0),
):
    # found_subcategory = subcategory_cruds.find_by_id(db, id, user.user_id)
    found_subcategory = subcategory_crud.find_by_id(db, id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="SubCategory not found")
    return found_subcategory

@router.get("/category_id/{category_id}", response_model=list[SubCategoryResponse], status_code=status.HTTP_200_OK)
async def find_subcategories_in_category(
    db: DbDependency, 
    category_id: int = Path(gt=0),
    limit: Optional[int] = None 
):
    return subcategory_crud.find_subcategories_in_category(db, category_id, limit)

@router.get("/", response_model=list[SubCategoryResponse], status_code=status.HTTP_200_OK)
async def find_by_name(
    db: DbDependency,
    name: str = Query(min_length=2, max_length=20)
):
    return subcategory_crud.find_by_name(db, name)

@router.post("/", response_model=SubCategoryResponse, status_code=status.HTTP_201_CREATED)
# async def create(db: DbDependency, category_id: int, subcategory_create: SubCategoryCreate):
async def create(db: DbDependency, subcategory_create: SubCategoryCreate):
    found_category = category_crud.find_by_id(db, subcategory_create.category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    pass
    return subcategory_crud.create(db, subcategory_create)

@router.put("/{id}", response_model=SubCategoryResponse, status_code=status.HTTP_200_OK)
async def update(
    db: DbDependency,
    subcategory_update: SubCategoryUpdate,
    id: int = Path(gt=0),
):
    updated_item = subcategory_crud.update2(db, id, subcategory_update)
    if not updated_item:
        raise HTTPException(status_code=404, detail="SubCategory not updated")
    return updated_item


@router.delete("/{id}", response_model=SubCategoryResponse, status_code=status.HTTP_200_OK)
async def delete(
    db: DbDependency,
    id: int = Path(gt=0)
):
    deleted_item = subcategory_crud.delete(db, id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not deleted")
    return deleted_item