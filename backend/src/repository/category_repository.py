from sqlalchemy.ext.asyncio import AsyncSession

from src.repository.base import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao


class CategorySchema(IdSchema):
    name: str


class CategoryCreate(BaseCreateDTO):
    name: str



class CategoryRead(BaseReadDTO):
    name: str
    

class CategoryRepository(
    BasicDao[CategorySchema, CategoryCreate, CategoryRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, CategorySchema, CategoryRead)
        
        