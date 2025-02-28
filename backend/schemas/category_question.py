from pydantic import BaseModel, Field

class CategoryQuestionResponse(BaseModel):
    category_id: int = Field(gt=0, example=1)
    question_id: int = Field(gt=0, example=1)