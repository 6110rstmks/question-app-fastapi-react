from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String

from src.repository.base.LogicalDeleteDao import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao


class CategorySchema(IdSchema):
    __tablename__ = "categories"
    name = mapped_column(String)


class CategoryCreate(BaseCreateDTO):
    name: str
    

class CategoryUpdate(BaseUpdateDTO):
    pass



class CategoryRead(BaseReadDTO):
    name: str
    

class CategoryRepository(
    BasicDao[CategorySchema, CategoryCreate, CategoryUpdate, CategoryRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, CategorySchema, CategoryRead)
        
        