from typing import Annotated
from fastapi import APIRouter, Path, Query, Depends, UploadFile
from sqlalchemy.orm import Session
from starlette import status
from cruds import category_crud as category_cruds
from schemas.category import CategoryResponse, CategoryCreate, CategoryImport, SubCategoryImport, QuestionImport
from schemas import auth
from database import get_db
from fastapi import Query
from config import PAGE_SIZE
from fastapi.responses import FileResponse
import os
from git import Repo

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
    return category_cruds.find_all(db, skip=skip, limit=limit, word=word)

# page_countのルーティング
@router.get("/page_count", response_model=int, status_code=status.HTTP_200_OK)
async def get_page_count(db: DbDependency):
    return category_cruds.get_page_count(db)

@router.get("/all", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(
    db: DbDependency,
    skip: int = Query(0, ge=0),
    limit: int = 7
):
    return (category_cruds.find_all(db))[skip : skip + limit]

@router.get("/all_categories_with_questions", response_model=list[CategoryResponse], status_code=status.HTTP_200_OK)
async def find_all(
    db: DbDependency,
    skip: int = Query(0, ge=0),
    limit: int = 7
    ):
    return (category_cruds.find_all_categories_with_questions(db))[skip : skip + limit]

@router.get("/", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
async def find_by_name(
    db: DbDependency, name: str = Query(min_length=2, max_length=20)
):
    return category_cruds.find_by_name(db, name)

@router.get("/category_id/{id}", response_model=CategoryResponse, status_code=status.HTTP_200_OK)
async def find_by_id(
    db: DbDependency,
    id: int = Path(gt=0),
):
    return category_cruds.find_by_id(db, id)

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create(db: DbDependency, category_create: CategoryCreate):
    return category_cruds.create(db, category_create)

# page_countのルーティング
@router.get("/page_count", response_model=int, status_code=status.HTTP_200_OK)
async def get_page_count(db: DbDependency):
    return category_cruds.get_page_count(db)

@router.get("/export", response_class=FileResponse)
async def get_exported_json(db: DbDependency):
    
    EXPORT_DIR = "export_data"
    
    # ディレクトリが存在しない場合は作成
    os.makedirs(EXPORT_DIR, exist_ok=True)
    FILE_NAME = "categories_export.json"
    FILE_PATH = os.path.join(EXPORT_DIR, FILE_NAME)
    # 本番で稼働させる場合は、環境変数にて設定
    REMOTE_URL = "https://github.com/6110rstmks/question-app-fastapi-react.git"
    
    EXPORT_DIR = os.path.abspath("export_data")
    FILE_PATH = os.path.join(EXPORT_DIR, "categories_export.json")
    
    # Generate the JSON file (optional: generate dynamically each request)
    category_cruds.export_to_json(db, FILE_PATH)
    
    print(FILE_PATH)
    print(373287)
    
    # GitHubにプッシュする処理
    # うまくいかないので諦める。
    try:
        # リポジトリの初期化または読み込み
        if not os.path.exists(os.path.join(EXPORT_DIR, ".git")):
            print(49739)
            repo = Repo.init(EXPORT_DIR)
            repo.create_remote("origin", REMOTE_URL)  # リモートリポジトリを追加
        else:
            print(27236)
            repo = Repo(EXPORT_DIR)
            # print(repo.remotes)
            if "origin" not in repo.remotes:
                print(4874687387)
                repo.create_remote("origin", REMOTE_URL)  # リモートリポジトリを追加

        print(337979)
        repo.git.add(FILE_NAME)
        repo.index.commit("Export categories data")
        origin = repo.remote(name="origin")
        origin.push()
    except Exception as e:
        return {"error": f"GitHub push failed: {str(e)}"}
    
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
    return await category_cruds.import_json_file(db, file)