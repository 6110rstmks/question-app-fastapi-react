from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, TIMESTAMP, Column

from backend.src.repository.base import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao
from backend.src.util.datetime_helper import get_now


class SubcategorySchema(IdSchema):
    __tablename__ = "subcategories"
    
    name = mapped_column(String)
    category_id = mapped_column(String)
    updated_at = Column(TIMESTAMP(timezone=True), nullable=True, default=get_now)


class SubcategoryCreate(BaseCreateDTO):
    name: str
    category_id: str


class SubcategoryUpdate(BaseUpdateDTO):
    name: str | None
    category_id: str | None


class SubcategoryRead(BaseReadDTO):
    name: str
    category_id: str


class SubcategoryRepository(
    BasicDao[SubcategorySchema, SubcategoryCreate, SubcategoryUpdate, SubcategoryRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, SubcategorySchema, SubcategoryRead)


    async def find_by_name(self, name: str) -> list[SubcategoryRead] | None:
        return await self._find_by_fields(name=name)
        
    