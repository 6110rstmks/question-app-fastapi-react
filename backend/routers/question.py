from typing import Annotated
from fastapi import APIRouter, Path, Query, HTTPException, Depends, FastAPI, Request
from sqlalchemy.orm import Session
from starlette import status
from cruds import question as question_cruds, auth as auth_cruds
from schemas.question import QuestionResponse, QuestionCreate, QuestionIsCorrectUpdate, QuestionUpdate
from schemas.problem import ProblemCreate
from schemas.auth import DecodedToken
from database import get_db
from cruds import question as question_cruds, category as category_cruds, subcategory as subcategory_cruds
from fastapi.responses import JSONResponse


DbDependency = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/questions", tags=["Questions"])
app = FastAPI()


# tags は、FastAPIでAPIルーターやエンドポイントにメタデータを追加するために使用されるオプションの引数です。これにより、APIドキュメント（例えば、Swagger UI）においてAPIエンドポイントをカテゴリごとにグループ化することができます。

# 問題を作成する。
@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create(db: DbDependency, question_create: QuestionCreate):
    found_category = category_cruds.find_by_id(db, question_create.category_id)
    if not found_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    found_subcategory = subcategory_cruds.find_by_id(db, question_create.subcategory_id)
    if not found_subcategory:
        raise HTTPException(status_code=404, detail="Category not found")
    return question_cruds.create(db, question_create)

class TypeException(Exception):
    def __init__(self, type: str):
        self.type = type
        
@app.exception_handler(TypeException)
async def type_exception_handler(request: Request, exc: TypeException):
    return JSONResponse(
        status_code=418,
        content={"message": f"{exc.type}という不明なタイプが入力されました。"},
    )

# 出題する問題群を生成する。
@router.post("/generate_problems", response_model=list[QuestionResponse], status_code=status.HTTP_201_CREATED)
async def generate_problems(db: DbDependency, problem_create: ProblemCreate):
    if problem_create.type != "category" and problem_create.type != "random":
        print('ここに入った')
        raise TypeException(problem_create.type)
    return question_cruds.generate_problems(db, problem_create)

@router.get("", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all(db: DbDependency):
    return question_cruds.find_all(db)


@router.get("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def find_by_id(db: DbDependency, id: int = Path(gt=0)):
    found_question = question_cruds.find_by_id(db, id)
    if not found_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return found_question

@router.get("/category_id/{category_id}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions_in_category(db: DbDependency, category_id: int = Path(gt=0)):
    return question_cruds.find_all_questions_in_category(db, category_id)

@router.get("/subcategory_id/{subcategory_id}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_all_questions_in_subcategory(db: DbDependency, subcategory_id: int = Path(gt=0)):
    return question_cruds.find_all_questions_in_subcategory(db, subcategory_id)


@router.get("/", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def find_by_name(
    db: DbDependency, name: str = Query(min_length=2, max_length=20)
):
    return question_cruds.find_by_name(db, name)



@router.put("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def update(
    db: DbDependency,
    question_update: QuestionUpdate,
    id: int = Path(gt=0),
):
    # updated_item = question_cruds.update(db, id, question_update, user.user_id)
    updated_item = question_cruds.update(db, id, question_update)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    return updated_item


@router.put("/change_is_correct/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def update(
    db: DbDependency,
    question_is_correct_update: QuestionIsCorrectUpdate,
    id: int = Path(gt=0),
):
    print(777766668)
    # updated_item = question_cruds.update(db, id, question_update, user.user_id)
    updated_item = question_cruds.update_is_correct(db, id, question_is_correct_update)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Question not updated")
    print(54888888)
    return updated_item




@router.delete("/{id}", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def delete(db: DbDependency, id: int = Path(gt=0)):
    # deleted_item = question_cruds.delete(db, id, user.user_id)
    deleted_item = question_cruds.delete(db, id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not deleted")
    return deleted_item
