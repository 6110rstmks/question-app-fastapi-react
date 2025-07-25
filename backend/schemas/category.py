from typing import  List
from pydantic import BaseModel, Field, ConfigDict


class CategoryCreate(BaseModel):
    name: str = Field(min_length=2, examples=["PC"])
    # user_id: int = Field(gt=0, examples=[1])

class CategoryResponse(BaseModel):
    id: int = Field(gt=0, examples=[1])
    name: str = Field(min_length=2, max_length=20, examples=["PC"])
    user_id: int

    model_config = ConfigDict(from_attributes=True)
    
class QuestionImport(BaseModel):
    id: int
    problem: str
    answer: List[str]
    is_correct: bool
class SubcategoryImport(BaseModel):
    id: int
    name: str
    questions: List[QuestionImport]
class CategoryImport(BaseModel):
    id: int
    name: str = Field(min_length=2, max_length=50)
    subcategories: List[SubcategoryImport] = []
    
class CategoryResponseWithQuestionCount(BaseModel):
    id: int
    name: str
    user_id: int
    question_count: int
    incorrected_answered_question_count: int

    model_config = ConfigDict(from_attributes=True)
    