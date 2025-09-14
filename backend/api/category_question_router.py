from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import APIRouter, Path,  Depends
from database import get_db
from starlette import status
from cruds import category_question_crud as category_question_cruds
from schemas.category_question import CategoryQuestionResponse

DbDependency = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/categories_questions", tags=["CategoriesQuestions"])

@router.get("/question_id/{question_id}", response_model=CategoryQuestionResponse, status_code=status.HTTP_200_OK)
async def find_categoryquestion_by_question_id(
    db: DbDependency,
    question_id: int = Path(gt=0),
):
    return category_question_cruds.find_categoryquestion_by_question_id(db, question_id)