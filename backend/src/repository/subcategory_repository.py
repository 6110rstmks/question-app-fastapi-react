from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, TIMESTAMP, Column, Integer

from src.repository.base.LogicalDeleteDao import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao
from src.util.datetime_helper import get_now


class SubcategorySchema(IdSchema):
    __tablename__ = "subcategories"
    
    name = mapped_column(String)
    category_id = mapped_column(Integer)
    updated_at = Column(TIMESTAMP(timezone=True), nullable=True, default=get_now)


class SubcategoryCreate(BaseCreateDTO):
    name: str
    category_id: int


class SubcategoryUpdate(BaseUpdateDTO):
    name: str | None = None
    category_id: int | None = None


class SubcategoryRead(BaseReadDTO):
    id: int
    name: str
    category_id: int
    question_count: int | None = None



class SubcategoryRepository(
    BasicDao[SubcategorySchema, SubcategoryCreate, SubcategoryUpdate, SubcategoryRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, SubcategorySchema, SubcategoryRead)


    async def find_by_name(self, name: str) -> list[SubcategoryRead] | None:
        return await self._find_by_fields(name=name)

    async def find_by_category_id(self, category_id: int) -> list[SubcategoryRead] | None:
        return await self._find_by_fields(category_id=category_id)

    async def find_by_name_like(self, name_pattern: str) -> list[SubcategoryRead]:
        """
        名前でLIKE検索を行います。
        
        :param name_pattern: 検索パターン（例: "%検索語%", "prefix%", "%suffix"）
        :return: 該当するSubcategoryのリスト
        """
        return await self._find_by_fields(like_fields={"name": name_pattern})

    async def find_by_name_contains(self, keyword: str) -> list[SubcategoryRead]:
        """
        名前に指定されたキーワードが含まれるレコードを検索します。
        
        :param keyword: 検索キーワード
        :return: 該当するSubcategoryのリスト
        """
        return await self._find_by_fields(like_fields={"name": f"%{keyword}%"})

    async def find_by_name_starts_with(self, prefix: str) -> list[SubcategoryRead]:
        """
        名前が指定されたプレフィックスで始まるレコードを検索します。
        
        :param prefix: プレフィックス
        :return: 該当するSubcategoryのリスト
        """
        return await self._find_by_fields_with_like(like_fields={"name": f"{prefix}%"})

    async def find_by_category_and_name_like(self, category_id: int, name_pattern: str) -> list[SubcategoryRead]:
        """
        カテゴリIDでの等価検索と名前でのLIKE検索を組み合わせます。
        
        :param category_id: カテゴリID
        :param name_pattern: 名前の検索パターン
        :return: 該当するSubcategoryのリスト
        """
        return await self._find_by_fields_with_like(
            like_fields={"name": name_pattern},
            category_id=category_id
        )