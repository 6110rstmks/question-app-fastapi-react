from sqlalchemy.ext.asyncio import AsyncSession

from src.repository.base import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao


class SubcategorySchema(IdSchema):
    name: str
    category_id: str


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
    BasicDao[SubcategorySchema, SubcategoryCreate, SubcategoryRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, SubcategorySchema, SubcategoryRead)


    async def find_by_name(self, name: str) -> list[SubcategoryRead] | None:
        return await self._find_by_fields(name=name)
        
    