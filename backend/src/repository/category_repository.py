from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Integer

from src.repository.base.LogicalDeleteDao import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao


class CategorySchema(IdSchema):
    __tablename__ = "categories"
    name = mapped_column(String)
    user_id = mapped_column(Integer)


class CategoryCreate(BaseCreateDTO):
    name: str
    

class CategoryUpdate(BaseUpdateDTO):
    pass



class CategoryRead(BaseReadDTO):
    id: int
    name: str
    user_id: int
    

class CategoryRepository(
    BasicDao[CategorySchema, CategoryCreate, CategoryUpdate, CategoryRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, CategorySchema, CategoryRead)
        
    async def find_by_name_contains(self, keyword: str) -> list[CategoryRead]:
        """
        名前に指定されたキーワードが含まれるレコードを検索します。
        
        :param keyword: 検索キーワード
        """
        return await self._find_by_fields(like_fields={"name": f"%{keyword}%"})

