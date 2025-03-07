from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class QuestionCreate(BaseModel):
    problem: str = Field(min_length=2, max_length=999, examples=["列志向データベースの強みを説明せよ"])
    answer: List[str] = Field(..., example=["Answer1", "Answer2"])
    memo: str = Field(max_length=300, examples=["ここにquestionに関するメモを記入できます。"])
    category_id: int = Field(gt=0, example=1)
    subcategory_id: int = Field(gt=0, example=1)
    
class QuestionUpdate(BaseModel):
    problem: str = Field(min_length=2, max_length=999, examples=["列志向データベースの強みを説明せよ"])
    answer: List[str] = Field(..., example=["Answer1", "Answer2"])
    memo: str = Field(max_length=300, examples=["ここにquestionに関するメモを記入できます。"])
    is_correct: bool = Field(default=False, example=False)
    
class QuestionIsCorrectUpdate(BaseModel):
    is_correct: bool = Field(default=False, example=False)
    
class QuestionBelongsToSubcategoryIdUpdate(BaseModel):
    category_ids: List[int] = Field(..., example=[1, 2, 3])
    subcategory_ids: List[int] = Field(..., example=[1, 2, 3])
    question_id: int = Field(gt=0, example=1)
    
class QuestionResponse(BaseModel):
    id: int = Field(gt=0, examples=[1])
    problem: str = Field(min_length=2, max_length=999, examples=["列志向データベースの強みを説明せよ"], description="問題文")
    answer: List[str] = Field(..., example=["Answer1", "Answer2"])
    memo: str = Field(max_length=300, examples=["ここにquestionに関するメモを記入できます。"])
    is_correct: bool = Field(default=False, example=False)
    answer_count: int = Field(default=0, example=0)
    last_answered_date: datetime = Field(default_factory=datetime.today)
    model_config = ConfigDict(from_attributes=True)
    

    
    
