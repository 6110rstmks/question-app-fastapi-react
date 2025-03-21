from pydantic import BaseModel, Field

from pydantic import BaseModel, Field
from typing import List, Optional

class ProblemFetch(BaseModel):
    type: str = Field(min_length=2, max_length=20, examples=["category"], description="問題の出題方法")
    incorrected_only_flg: bool = Field(default=False, example=False, description="不正解の問題からのみするかどうか")
    problem_cnt: int = Field(gt=0, example=10, description="出題する問題数")
    category_ids: List[int] = Field(..., example=[38, 40], description="出題するカテゴリーID群")
    subcategory_ids: Optional[List[int]] = Field(None, example=[1, 2], description="出題するサブカテゴリーID群") 

class ProblemFetchByDate(BaseModel):
    date: str = Field(min_length=10, max_length=10, examples=["2021-01-01"], description="出題する問題の日付")
    