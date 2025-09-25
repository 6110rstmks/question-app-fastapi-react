from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Integer
from sqlalchemy import select, func
from models import Category

from src.repository.base.LogicalDeleteDao import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao


class CategorySchema(IdSchema):
    __tablename__ = "categories"
    name = mapped_column(String)
    user_id = mapped_column(Integer)
    pinned_order = mapped_column(Integer)


class CategoryCreate(BaseCreateDTO):
    name: str
    user_id: int


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

    async def check_name_exists(self, name: str) -> bool:
        """
        指定された名前のレコードが存在するかどうかを確認します。
        
        :param name: 確認する名前
        :return: 存在する場合はTrue、存在しない場合はFalse
        """
        stmt = select(Category).where(func.lower(Category.name) == func.lower(name))
        result = await self.db.execute(stmt)
        return result.scalars().first() is not None
    
    async def count_all(self) -> int:
        stmt = select(func.count()).select_from(self.model)
        total_count = await self.db.scalar(stmt)
        return total_count
