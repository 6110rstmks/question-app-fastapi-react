from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class SubcategoryCreate(BaseModel):
    name: str = Field(min_length=2, examples=["q normalization"])
    category_id: int = Field(gt=0, examples=[1])
    
class SubcategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, examples=["q normalization"])

class SubcategoryResponse(BaseModel):
    id: int = Field(gt=0, examples=[1])
    name: str = Field(min_length=2, examples=["q normalization"])
    category_id: int

    model_config = ConfigDict(from_attributes=True)