from typing import Annotated
from fastapi import APIRouter, Path, Query, Depends, UploadFile
from sqlalchemy.orm import Session
from starlette import status
from cruds import category_crud as category_cruds
from schemas.category import CategoryResponse, CategoryCreate, CategoryImport, SubcategoryImport, QuestionImport
from schemas import auth
from database import get_db
from fastapi import Query
from config import PAGE_SIZE
from fastapi.responses import FileResponse, RedirectResponse
import os
from git import Repo
from src import data_io

DbDependency = Annotated[Session, Depends(get_db)]

# UserDependency = Annotated[auth.DecodedToken, Depends(auth_cruds.get_current_user)]

router = APIRouter(prefix="/categories", tags=["Categories"])

# tags は、FastAPIでAPIルーターやエンドポイントにメタデータを追加するために使用されるオプションの引数です。これにより、APIドキュメント（例えば、Swagger UI）においてAPIエンドポイントをカテゴリごとにグループ化することができます。

@router.get("/home", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(
    db: DbDependency,
    limit: int = PAGE_SIZE,
    skip: int = Query(0, ge=0),
    word: str = None
    ):
    return category_cruds.find_all(db, skip=skip, limit=limit, word=word)

# page_countのルーティング
@router.get("/page_count", response_model=int, status_code=status.HTTP_200_OK)
async def get_page_count(db: DbDependency):
    return category_cruds.get_page_count(db)

@router.get("/all", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(
    db: DbDependency,
    skip: int = Query(0, ge=0),
    limit: int = 5
):
    return (category_cruds.find_all(db))[skip : skip + limit]

@router.get("/all_categories_with_questions", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(
    db: DbDependency,
    skip: int = Query(0, ge=0),
    limit: int = 7
    ):
    return (category_cruds.find_all_categories_with_questions(db))[skip : skip + limit]


@router.get("/category_id/{id}", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
async def find_by_id(
    db: DbDependency,
    id: int = Path(gt=0),
):
    return category_cruds.find_by_id(db, id)

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create(db: DbDependency, category_create: CategoryCreate):
    return category_cruds.create(db, category_create)

@router.get("/export", response_class=FileResponse)
async def get_exported_json(db: DbDependency):
    
    EXPORT_DIR = "export_data" 
    FILE_NAME = "categories_export4.json"

    # ディレクトリが存在しない場合は作成
    os.makedirs(EXPORT_DIR, exist_ok=True)
    FILE_PATH = os.path.join(EXPORT_DIR, FILE_NAME)
    
    EXPORT_DIR = os.path.abspath("export_data")
    data_io.export_to_json(db, FILE_PATH)
    git_push_json_file()
    # Check if the file exists
    if not os.path.exists(FILE_PATH):
        return {"error": "File not found"}
    
    # Return the file as a response
    return FileResponse(FILE_PATH, media_type="application/json", filename="categories_export4.json")


@router.post("/import", status_code=status.HTTP_201_CREATED)
async def upload_json(
    file: UploadFile,
    db: Session = Depends(get_db),
):
    return await category_cruds.import_json_file(db, file)

def git_push_json_file():
    EXPORT_DIR = os.path.abspath("export_data")

    REPO_DIR = os.path.abspath(os.path.join(os.path.abspath(""), ".."))
    INDEX_ADD_FILE_PATH = os.path.join(EXPORT_DIR, "categories_export4.json")
    repo = Repo(REPO_DIR)
    repo.index.add([INDEX_ADD_FILE_PATH])
    is_untracked = INDEX_ADD_FILE_PATH not in repo.git.ls_files().splitlines()
    

    # if repo.is_dirty(untracked_files=True):
    #     repo.git.stash('push', '-m', 'Save current changes before branch switch')
    
    if 'bsackup/json' not in repo.branches:
        repo.git.checkout('HEAD', b='bsackup/json')  # Create and switch to the new branch
        print(2221111)
    # else:
    #     repo.git.checkout('backup/json')  #
        
    print(287297)

    if repo.git.diff(INDEX_ADD_FILE_PATH) or is_untracked:  
        # Check if there are unstaged changes for the file
        # repo.index.add([INDEX_ADD_FILE_PATH])
        repo.index.commit("Export categories data")
        origin = repo.remote(name="origin")
        
        # origin.push('bsackup/json')
        origin.push()
        
    # repo.git.checkout('main') # Switch back to the main branch
        
    
    # if repo.git.stash('list'):
    #     repo.git.stash('pop')
    
    # if 'backup/json' in repo.branches:
    #     repo.git.branch('-D', 'bsackup/json')  # D


