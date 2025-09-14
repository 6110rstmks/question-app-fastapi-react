from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import Integer, PrimaryKeyConstraint, ForeignKey

from src.repository.base.BasicDao import BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao
from src.repository.base.composite_base import CompositeKeySchema, CompositeKeyDao


class SubcategoryQuestionSchema(CompositeKeySchema):
    __tablename__ = "subcategory_question"
    subcategory_id = mapped_column(Integer, ForeignKey("subcategories.id"))
    question_id = mapped_column(Integer, ForeignKey("questions.id"))

    __table_args__ = (PrimaryKeyConstraint('subcategory_id', 'question_id'),)

class SubcategoryQuestionCreate(BaseCreateDTO):
    subcategory_id: int
    question_id: int
    

class SubcategoryQuestionUpdate(BaseUpdateDTO):
    pass


class SubcategoryQuestionRead(BaseReadDTO):
    subcategory_id: int
    question_id: int


class SubcategoryQuestionRepository(
    CompositeKeyDao[SubcategoryQuestionSchema, SubcategoryQuestionCreate, SubcategoryQuestionUpdate, SubcategoryQuestionRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, SubcategoryQuestionSchema, SubcategoryQuestionRead)

    async def find_by_question_id(self, question_id: int) -> list[SubcategoryQuestionRead] | None:
        return await self._find_by_fields(question_id=question_id)
