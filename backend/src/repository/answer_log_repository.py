from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Integer
from sqlalchemy import select, func
from models import AnswerLogs

from src.repository.base.LogicalDeleteDao import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao

class AnswerLogSchema(IdSchema):
    __tablename__ = "answer_logs"
    category_id = mapped_column(Integer, nullable=False)
    subcategory_id = mapped_column(Integer, nullable=False)
    question_id = mapped_column(Integer, nullable=False)
    is_correct = mapped_column(Integer, nullable=False)  # 1: correct, 0: incorrect
    date = mapped_column(String, nullable=False)  # 'YYYY-MM-DD' format
    
class AnswerLogCreate(BaseCreateDTO):
    category_id: int
    subcategory_id: int
    question_id: int
    is_correct: int  # 1: correct, 0: incorrect
    date: str  # 'YYYY-MM-DD' format
    
class AnswerLogRead(BaseReadDTO):
    id: int
    category_id: int
    subcategory_id: int
    question_id: int
    is_correct: int  # 1: correct, 0: incorrect
    date: str  # 'YYYY-MM-DD' format