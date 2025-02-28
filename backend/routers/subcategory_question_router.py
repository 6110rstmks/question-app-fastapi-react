from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import APIRouter, Path, Query, Depends, UploadFile
from database import get_db
from starlette import status
from cruds import subcategory_question_crud as subcategory_question_cruds
from schemas.subcategory_question import SubcategoryQuestionResponse

DbDependency = Annotated[Session, Depends(get_db)]

router = APIRouter(prefix="/subcategories_questions", tags=["SubcategoriesQuestions"])

@router.get("/{question_id}", response_model=list[SubcategoryQuestionResponse], status_code=status.HTTP_200_OK)
async def find_subcategoriesquestions_by_question_id(
    db: DbDependency,
    question_id: int = Path(gt=0),
):
    return subcategory_question_cruds.find_subcategoriesquestions_by_question_id(db, question_id)
