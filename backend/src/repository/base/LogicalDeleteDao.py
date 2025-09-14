from datetime import datetime
from typing import Any, Iterable, List, Literal, Optional, Type, TypeVar

from pydantic import BaseModel
from sqlalchemy import TIMESTAMP, asc, delete, desc, insert, Integer, update
from sqlalchemy.future import select
from sqlalchemy.orm import Mapped, mapped_column

from src.lib.database import SqlAlchemyBase
from src.util.datetime_helper import get_now
from src.repository.base.BasicDao import BasicDao


class BaseSchema(SqlAlchemyBase):
    __abstract__ = True


class IdSchema(BaseSchema):
    __abstract__ = True

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

class LogicalDeleteSchema(IdSchema):
    __abstract__ = True

    deleted_at: Mapped[datetime | None] = mapped_column(type_=TIMESTAMP(timezone=True), nullable=True, default=None)


TCreateDTO = TypeVar("TCreateDTO", bound="BaseCreateDTO")
TEntity = TypeVar("TEntity", bound="BaseSchema")


class BaseCreateDTO(BaseModel):
    def to_entity(self, model: Type[TEntity]) -> TEntity:
        """
        自身の値から、エンティティを作成。
        model: SQLAlchemyのモデルクラス（BaseSchemaを継承）
        """
        return model(**self.model_dump())


TUpdateDTO = TypeVar("TUpdateDTO", bound="BaseUpdateDTO")


class BaseUpdateDTO(BaseModel):
    def apply_to(self, entity: TEntity) -> TEntity:
        """
        自身の値を既存エンティティに上書き。
        entity: 既存のインスタンス（BaseSchemaを継承）
        """
        for field, value in self.model_dump(exclude_unset=True).items():
            setattr(entity, field, value)
        return entity


T = TypeVar("T", bound="BaseReadDTO")


class BaseReadDTO(BaseModel):
    @classmethod
    def from_entity(cls: Type[T], entity: Any) -> T:
        """
        デフォルトはBaseModel#model_validate
        カスタム処理をしたい場合は各DTOで override する
        """
        return cls.model_validate(entity, from_attributes=True)


ModelType = TypeVar("ModelType", bound=IdSchema)
LogicalDeleteModelType = TypeVar("LogicalDeleteModelType", bound=LogicalDeleteSchema)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseCreateDTO)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseUpdateDTO)
ReadSchemaType = TypeVar("ReadSchemaType", bound=BaseReadDTO)
K = TypeVar("K")


class LogicalDeleteDao(BasicDao[LogicalDeleteModelType, CreateSchemaType, UpdateSchemaType, ReadSchemaType]):
    """
    論理削除に対応した非同期のDB操作の基底クラス。
    **継承したクラスで使いたいメソッドのテストを書くこと**

    :param db: 非同期SQLAlchemyセッション
    :param model: SQLAlchemyのモデルクラス（BaseSchemaを継承）
    :param read_schema: レスポンス用のPydanticスキーマクラス
    """
    
    async def get_all(self, include_deleted: bool = False) -> List[ReadSchemaType]:
        """
        全件のレコードを取得します。

        :param include_deleted: 論理削除されたレコードも含めるか
        :return: レコードのリスト
        """
        return await self._find_by_fields(include_deleted=include_deleted)

    async def _find_by_fields(
        self,
        order_by: list[tuple[str, Literal["asc", "desc"]]] | None = None,
        limit: int | None = None,
        include_deleted: bool = False,
        **kwargs: Any,
    ) -> list[ReadSchemaType]:
        """
        任意のカラム値に基づいてレコードを検索します。
        複数カラム指定可能。値に list/tuple/set を渡すと IN 条件になります。

        :param include_deleted: 論理削除されたレコードも含めるか
        :param kwargs: 検索対象のカラム名と値のマッピング
        :return: 該当レコードのリスト（Pydanticスキーマ形式）
        """
        stmt = select(self.model)

        for field_name, value in kwargs.items():
            column = getattr(self.model, field_name, None)
            if column is not None:
                if isinstance(value, Iterable) and not isinstance(value, (str, bytes)):
                    stmt = stmt.where(column.in_(value))
                else:
                    stmt = stmt.where(column == value)

        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))

        if order_by:
            for col_name, direction in order_by:
                col = getattr(self.model, col_name, None)
                if col is not None:
                    stmt = stmt.order_by(desc(col) if direction == "desc" else asc(col))

        if limit is not None:
            stmt = stmt.limit(limit)

        result = await self.db.execute(stmt)
        objs = result.scalars().all()
        return [self.read_schema.from_entity(obj) for obj in objs]

    async def soft_delete(self, id: int, autocommit=True) -> bool:
        """
        指定IDのレコードを論理削除します。

        :param id: 対象レコードのUUID
        :param autocommit: メソッド内でコミットするか
        :return: 論理削除が成功したか
        """
        db_obj = await self._get(id)
        if not db_obj:
            return False

        db_obj.deleted_at = get_now()
        if autocommit:
            await self.db.commit()
        return True

    async def hard_delete(self, id: int, autocommit=True) -> bool:
        """
        指定IDのレコードを物理削除します。

        :param id: 対象レコードのUUID
        :param autocommit: メソッド内でコミットするか
        :return: 物理削除が成功したか
        """
        return await self.delete(id, autocommit)
    
    async def _soft_delete_by_fields(self, autocommit=True, **kwargs: Any) -> int:
        stmt = update(self.model)
        for field_name, value in kwargs.items():
            column = getattr(self.model, field_name, None)
            if column is not None:
                if isinstance(value, Iterable) and not isinstance(value, (str, bytes)):
                    stmt = stmt.where(column.in_(value))
                else:
                    stmt = stmt.where(column == value)
        result = await self.db.execute(stmt.value(deleted_at=get_now()))
        if autocommit:
            await self.db.commit()
        return result.rowcount

    async def _get(self, id: int) -> LogicalDeleteModelType | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id, self.model.deleted_at.is_(None)))
        return result.scalars().first()