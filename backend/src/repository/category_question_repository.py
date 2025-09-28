from sqlalchemy import Integer, PrimaryKeyConstraint, ForeignKey
from sqlalchemy.orm import mapped_column
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import Integer, PrimaryKeyConstraint, ForeignKey

from src.repository.base.composite_base import CompositeKeySchema, CompositeKeyDao
from src.repository.base.BasicDao import BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao


class CategoryQuestionSchema(CompositeKeySchema):
    __tablename__ = "category_question"
    category_id = mapped_column(Integer, ForeignKey("categories.id"))
    question_id = mapped_column(Integer, ForeignKey("questions.id"))

    __table_args__ = (PrimaryKeyConstraint('category_id', 'question_id'),)
    
class CategoryQuestionCreate(BaseCreateDTO):
    category_id: int
    question_id: int
    
class CategoryQuestionUpdate(BaseUpdateDTO):
    pass

class CategoryQuestionRead(BaseReadDTO):
    category_id: int
    question_id: int
    
    
class CategoryQuestionRepository(
    CompositeKeyDao[CategoryQuestionSchema, CategoryQuestionCreate, CategoryQuestionUpdate, CategoryQuestionRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, CategoryQuestionSchema, CategoryQuestionRead)

    async def find_by_question_id(self, question_id: int) -> list[CategoryQuestionRead] | None:
        return await self._find_by_fields(question_id=question_id)
    
    async def find_by_question_ids(self, question_ids: list[int]) -> list[CategoryQuestionRead] | None:
        return await self._find_by_fields(question_id=question_ids)

    async def find_by_category_id(self, category_id: int) -> list[CategoryQuestionRead] | None:
        return await self._find_by_fields(category_id=category_id)

    async def delete_by_question_id(self, question_id: int) -> None:
        await self._delete_by_fields(question_id=question_id)
