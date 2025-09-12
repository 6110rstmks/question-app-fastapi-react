from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class SubcategoryCreateSchema(BaseModel):
    name: str = Field(min_length=1, examples=["q normalization"])
    category_id: int = Field(gt=0, examples=[1])
    
class SubcategoryUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=1, examples=["q normalization"])

class SubcategoryResponse(BaseModel):
    id: int = Field(gt=0, examples=[1])
    name: str = Field(min_length=1, examples=["q normalization"])
    category_id: int

    model_config = ConfigDict(from_attributes=True)
    
class SubcategoryResponseWithQuestionCount(BaseModel):
    id: int
    name: str
    category_id: int
    question_count: int

    model_config = ConfigDict(from_attributes=True)
    
class SubcategoryWithCategoryNameResponse(BaseModel):
    id: int
    name: str
    category_id: int
    category_name: str

    model_config = ConfigDict(from_attributes=True)