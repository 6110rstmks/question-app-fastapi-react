from fastapi import APIRouter, status, Request, FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from backend.schemas.problem import ProblemFetch
from backend.schemas.question import QuestionResponse
from backend.database import get_db
from typing import Annotated
from fastapi.responses import JSONResponse
from backend.cruds import problem_crud

class TypeException(Exception):
    def __init__(self, type: str):
        self.type = type

DbDependency = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/problems", tags=["Problems"])

app = FastAPI()

@app.exception_handler(TypeException)
async def type_exception_handler(request: Request, exc: TypeException):
    return JSONResponse(
        status_code=418,
        content={"message": f"{exc.type}という不明なタイプが入力されました。"},
    )
    
# 出題する問題群を生成する。
@router.post("/", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def generate_problems(
    db: DbDependency, 
    problem_create: ProblemFetch
):
    if problem_create.type not in {"category", "random", "subcategory"}:
        raise TypeException(problem_create.type)
    return problem_crud.generate_problems(db, problem_create)

# 特定の日に出題する問題を取得する。
@router.get("/day/{day}", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def generate_problems_by_day(
    db: DbDependency, 
    day: str
):
    return problem_crud.generate_problems_by_day(db, day)

# 今日解いた問題を取得する。
@router.get("/today", response_model=list[QuestionResponse], status_code=status.HTTP_200_OK)
async def get_today_problems(
    db: DbDependency
):
    return problem_crud.get_today_problems(db)