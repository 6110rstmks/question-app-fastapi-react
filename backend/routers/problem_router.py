from fastapi import APIRouter, status, Request, FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from schemas.problem import ProblemCreate
from schemas.question import QuestionResponse
from database import get_db
from typing import Annotated
from fastapi.responses import JSONResponse
from cruds import problem_crud


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
@router.post("/generate_problems", response_model=list[QuestionResponse], status_code=status.HTTP_201_CREATED)
async def generate_problems(db: DbDependency, problem_create: ProblemCreate):
    if problem_create.type != "category" and problem_create.type != "random":
        raise TypeException(problem_create.type)
    return problem_crud.generate_problems(db, problem_create)