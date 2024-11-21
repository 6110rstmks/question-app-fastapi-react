from typing import Annotated
from fastapi import APIRouter, Path, Query, HTTPException, Depends, UploadFile
from sqlalchemy.orm import Session
from starlette import status
from cruds import category_crud as category_curds
from schemas.category import CategoryResponse, CategoryCreate, CategoryImport, SubCategoryImport, QuestionImport
from schemas import auth
from database import get_db
from fastapi import Query
from config import PAGE_SIZE
from fastapi.responses import FileResponse
import os
import json
from models import Category, SubCategory, Question, SubCategoryQuestion, CategoryQuestion


DbDependency = Annotated[Session, Depends(get_db)]

# UserDependency = Annotated[auth.DecodedToken, Depends(auth_cruds.get_current_user)]

router = APIRouter(prefix="/categories", tags=["Categories"])

# tags は、FastAPIでAPIルーターやエンドポイントにメタデータを追加するために使用されるオプションの引数です。これにより、APIドキュメント（例えば、Swagger UI）においてAPIエンドポイントをカテゴリごとにグループ化することができます。

@router.get("", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(
    db: DbDependency,
    skip: int = Query(0, ge=0),
    limit: int = PAGE_SIZE,
    word: str = None
    ):
    return category_curds.find_all(db, skip=skip, limit=limit, word=word)

# page_countのルーティング
@router.get("/page_count", response_model=int, status_code=status.HTTP_200_OK)
async def get_page_count(db: DbDependency):
    return category_curds.get_page_count(db)


@router.get("/all", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(
    db: DbDependency,
    skip: int = Query(0, ge=0),
    limit: int = 7
    ):
    return (category_curds.find_all(db))[skip : skip + limit]

@router.get("/all_categories_with_questions", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(
    db: DbDependency,
    skip: int = Query(0, ge=0),
    limit: int = 7
    ):
    return (category_curds.find_all_categories_with_questions(db))[skip : skip + limit]

# カテゴリをIDで取得
# @router.get("/{id}", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
# async def find_by_id(db: DbDependency, user: UserDependency, id: int = Path(gt=0)): # type: ignore
#     found_category = category_curds.find_by_id(db, id, user.user_id)
#     if not found_category:
#         raise HTTPException(status_code=404, detail="Category not found")
#     return found_category


@router.get("/", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_by_name(
    db: DbDependency, name: str = Query(min_length=2, max_length=20)
):
    return category_curds.find_by_name(db, name)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create(db: DbDependency, category_create: CategoryCreate):
    return category_curds.create(db, category_create)


# page_countのルーティング
@router.get("/page_count", response_model=int, status_code=status.HTTP_200_OK)
async def get_page_count(db: DbDependency):
    print(888899999)
    return category_curds.get_page_count(db)


@router.get("/export", response_class=FileResponse)
async def get_exported_json(db: DbDependency):
    
    EXPORT_DIR = "export_data"
    
    # ディレクトリが存在しない場合は作成
    os.makedirs(EXPORT_DIR, exist_ok=True)
    FILE_NAME = "categories_export.json"
    FILE_PATH = os.path.join(EXPORT_DIR, FILE_NAME)
    
    # Generate the JSON file (optional: generate dynamically each request)
    category_curds.export_to_json(db, FILE_PATH)
    
    # Check if the file exists
    if not os.path.exists(FILE_PATH):
        return {"error": "File not found"}
    
    # Return the file as a response
    return FileResponse(FILE_PATH, media_type="application/json", filename="categories_export.json")


@router.post("/import", status_code=status.HTTP_201_CREATED)
async def upload_json(
    file: UploadFile,
    db: Session = Depends(get_db),
):
    return await category_curds.import_json_file(db, file)