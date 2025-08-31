from backend.models import SubcategoryQuestion
from sqlalchemy.orm import Session
from backend.schemas.subcategory_question import SubcategoryQuestionResponse
from typing import Optional
from sqlalchemy import select

def find_subcategory_question_by_question_id(
    db: Session, 
    question_id: int
) -> Optional[SubcategoryQuestionResponse]:
    query = (
        select(SubcategoryQuestion).where(SubcategoryQuestion.question_id == question_id)
    )

    return db.execute(query).scalars().first()