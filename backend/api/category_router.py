from typing import Annotated, Optional
from fastapi import APIRouter, Path, Query, Depends, UploadFile, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from cruds import category_crud as category_cruds
from schemas.category import CategoryResponse, CategoryCreate, CategoryResponseWithQuestionCount
from database import get_db
from fastapi import Query
from config import PAGE_SIZE
from fastapi.responses import FileResponse
import os
from git import Repo
from src import data_io_json, data_io_csv
import zipfile

DbDependency = Annotated[Session, Depends(get_db)]

# UserDependency = Annotated[auth.DecodedToken, Depends(auth_cruds.get_current_user)]

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get(
    "/home", 
    response_model=Optional[list[CategoryResponse]], 
    status_code=status.HTTP_200_OK
)
async def find_all(
    db: DbDependency,
    limit: int = PAGE_SIZE,
    skip: int = Query(0, ge=0),
    categoryWord: str = None,
    subcategoryWord: str = None,
    questionWord: str = None,
    answerWord: str = None
):
    return category_cruds.find_all(
        db, 
        skip=skip, 
        limit=limit, 
        category_word=categoryWord, 
        subcategory_word=subcategoryWord, 
        question_word=questionWord, 
        answer_word=answerWord
    )

@router.get("/search", response_model=Optional[list[CategoryResponse]], status_code=status.HTTP_200_OK)
async def find_category_by_name(
    db: DbDependency,
    search_word: str
):
    return category_cruds.find_category_by_name(db, search_word)

# question_idからQuestionに紐づくCategoryを取得するエンドポイント
@router.get("/question_id/{question_id}", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
async def find_category_by_question_id(
    db: DbDependency, 
    question_id: int = Path(gt=0)
):
    found_category = category_cruds.find_category_by_question_id(db, question_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return found_category

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

@router.get("/all_categories", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all_categories(
    db: DbDependency
):
    return (category_cruds.find_all_categories(db))

@router.get(
    "/all_categories_with_questions", 
    response_model=list[CategoryResponseWithQuestionCount], 
    status_code=status.HTTP_200_OK
)
async def find_all(
    db: DbDependency,
):
    return (category_cruds.find_all_categories_with_questions(db))

@router.get("/category_id/{id}", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
async def find_category_by_id(
    db: DbDependency,
    id: int = Path(gt=0),
):
    return category_cruds.find_category_by_id(db, id)

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create(
    db: DbDependency, 
    category_create: CategoryCreate
):
    return category_cruds.create(db, category_create)

@router.get("/export/json", response_class=FileResponse)
async def get_exported_json(db: DbDependency):
    
    EXPORT_DIR = "export_data" 
    FILE_NAME = "categories_export4.json"

    # ディレクトリが存在しない場合は作成
    os.makedirs(EXPORT_DIR, exist_ok=True)
    FILE_PATH = os.path.join(EXPORT_DIR, FILE_NAME)
    
    EXPORT_DIR = os.path.abspath("export_data")
    data_io_json.export_to_json(db, FILE_PATH)
    git_push_json_file()
    # Check if the file exists
    if not os.path.exists(FILE_PATH):
        return {"error": "File not found"}
    
    # Return the file as a response
    return FileResponse(FILE_PATH, media_type="application/json", filename="categories_export4.json")

# @router.get("/export", response_class=FileResponse)
# async def get_exported_json(db: DbDependency):
#     EXPORT_DIR = os.path.abspath("export_data")  # ← ディレクトリパスを作る
#     FILE_NAME = "categories.csv"

#     # ディレクトリを作成
#     os.makedirs(EXPORT_DIR, exist_ok=True)
#     # ファイル出力処理
#     # export_models_to_csv には「ディレクトリパス」を渡すべき！
#     data_io.export_models_to_csv(db, EXPORT_DIR)

#     # 作成された CSV ファイルのフルパス
#     FILE_PATH = os.path.join(EXPORT_DIR, FILE_NAME)

#     # Check if the file exists
#     if not os.path.exists(FILE_PATH):
#         return {"error": "File not found"}

#     # Return the file as a response
#     return FileResponse(
#         FILE_PATH,
#         media_type="text/csv",
#         filename="categories.csv"
#     )

@router.get("/export/csv", response_class=FileResponse)
async def get_exported_zip(db: DbDependency):
    EXPORT_DIR = os.path.abspath("export_data")
    ZIP_FILE_NAME = "backup_self_made_app.zip"
    ZIP_FILE_PATH = os.path.join(EXPORT_DIR, ZIP_FILE_NAME)

    # 出力ディレクトリ作成
    os.makedirs(EXPORT_DIR, exist_ok=True)

    # CSVファイル出力（categories.csv と subcategories.csv）
    data_io_csv.export_data_to_csv(db, EXPORT_DIR)

    # ZIPファイル作成
    with zipfile.ZipFile(ZIP_FILE_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
        categories_csv = os.path.join(EXPORT_DIR, 'categories.csv')
        subcategories_csv = os.path.join(EXPORT_DIR, 'subcategories.csv')
        questions_csv = os.path.join(EXPORT_DIR, 'questions.csv')
        categories_questions_csv = os.path.join(EXPORT_DIR, 'categories_questions.csv')
        subcategories_questions_csv = os.path.join(EXPORT_DIR, 'subcategories_questions.csv')

        # ファイルが存在するかチェック（念のため）
        if os.path.exists(categories_csv):
            zipf.write(categories_csv, arcname='categories.csv')
        if os.path.exists(subcategories_csv):
            zipf.write(subcategories_csv, arcname='subcategories.csv')
        if os.path.exists(questions_csv):
            zipf.write(questions_csv, arcname='questions.csv')
        if os.path.exists(categories_questions_csv):
            zipf.write(categories_questions_csv, arcname='categories_questions.csv')
        if os.path.exists(subcategories_questions_csv):
            zipf.write(subcategories_questions_csv, arcname='subcategories_questions')

    # ZIPファイルが無い場合はエラー
    if not os.path.isfile(ZIP_FILE_PATH):
        return {"error": f"ZIP file not found at {ZIP_FILE_PATH}"}

    # ZIPファイルを返す
    return FileResponse(
        ZIP_FILE_PATH,
        media_type="application/zip",
        filename=ZIP_FILE_NAME
    )

#    # ZIPファイルのパス
#     zip_path = "files.zip"
    
#     # 複数のファイルをまとめる
#     files_to_include = ["file1.json", "file2.json"]
#     with zipfile.ZipFile(zip_path, "w") as zipf:
#         for file in files_to_include:
#             zipf.write(file, arcname=Path(file).name)
    
#     # ZIPファイルをレスポンスとして返す
#     return FileResponse(zip_path, media_type="application/zip", filename="files.zip")


@router.post("/import", status_code=status.HTTP_201_CREATED)
async def upload_json(
    file: UploadFile,
    db: Session = Depends(get_db),
):
    return await data_io_json.import_json_file(db, file)

def git_push_json_file():
    EXPORT_DIR = os.path.abspath("export_data")
    
    REPO_DIR = os.path.abspath("")
    INDEX_ADD_FILE_PATH = os.path.join(EXPORT_DIR, "categories_export4.json")
    repo = Repo(REPO_DIR)
    repo.index.add([INDEX_ADD_FILE_PATH])
    is_untracked = INDEX_ADD_FILE_PATH not in repo.git.ls_files().splitlines()
    

    # if repo.is_dirty(untracked_files=True):
    #     repo.git.stash('push', '-m', 'Save current changes before branch switch')
    
    if 'bsackup/json' not in repo.branches:
        repo.git.checkout('HEAD', b='bsackup/json')  # Create and switch to the new branch
    # else:
    #     repo.git.checkout('backup/json')  #
        

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


