from pydantic import BaseModel, Field

class SubcategoryQuestionResponse(BaseModel):
    subcategory_id: int = Field(gt=0, example=1)
    question_id: int = Field(gt=0, example=1)
    