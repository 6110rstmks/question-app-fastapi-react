import uuid
from collections import defaultdict
from datetime import datetime
from typing import Any, Callable, Generic, Iterable, List, Literal, Optional, Type, TypeVar

from pydantic import BaseModel
from sqlalchemy import TIMESTAMP, Uuid, asc, delete, desc, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Mapped, mapped_column

from backend.src.lib.database import SqlAlchemyBase
from backend.src.util.datetime_helper import get_now


class BaseSchema(SqlAlchemyBase):
    __abstract__ = True


class IdSchema(BaseSchema):
    __abstract__ = True

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), default=uuid.uuid4, primary_key=True)


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
        return cls.model_validate(entity)


ModelType = TypeVar("ModelType", bound=IdSchema)
LogicalDeleteModelType = TypeVar("LogicalDeleteModelType", bound=LogicalDeleteSchema)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseCreateDTO)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseUpdateDTO)
ReadSchemaType = TypeVar("ReadSchemaType", bound=BaseReadDTO)
K = TypeVar("K")


class BasicDao(Generic[ModelType, CreateSchemaType, UpdateSchemaType, ReadSchemaType]):
    """
    非同期のDB操作の基底クラス。
    CRUD操作と論理削除を型安全に抽象化するためのジェネリックなDAOです。
    **継承したクラスで使いたいメソッドのテストを書くこと**

    :param db: 非同期SQLAlchemyセッション
    :param model: SQLAlchemyのモデルクラス（BaseSchemaを継承）
    :param read_schema: レスポンス用のPydanticスキーマクラス
    """

    def __init__(self, db: AsyncSession, model: Type[ModelType], read_schema: Type[ReadSchemaType]):
        self.db = db
        self.model = model
        self.read_schema = read_schema

    async def get(self, id: uuid.UUID) -> Optional[ReadSchemaType]:
        """
        IDに基づいて1件のレコードを取得します。

        :param id: 対象レコードのUUID
        :return: 該当するレコード、存在しない場合はNone
        """
        db_obj = await self._get(id)
        if not db_obj:
            return None
        return self.read_schema.from_entity(db_obj)

    async def get_all(self) -> List[ReadSchemaType]:
        """
        全件のレコードを取得します。

        :return: レコードのリスト
        """
        return await self._find_by_fields()

    async def find_by_ids(self, ids: list[uuid.UUID]) -> list[ReadSchemaType]:
        """
        指定したIDのレコードを取得します。

        :param ids: 検索対象のIDのリスト
        :return: レコードのリスト
        """
        return await self._find_by_fields(id=ids)

    async def _find_by_fields(
        self, order_by: list[tuple[str, Literal["asc", "desc"]]] | None = None, limit: int | None = None, **kwargs: Any
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

    async def _find_grouped_by_fields(
        self, key: Callable[[ReadSchemaType], K], **kwargs: Any
    ) -> dict[K, list[ReadSchemaType]]:
        """
        任意のカラム値に基づいてレコードを検索し、指定したKeyでグルーピングします。
        複数カラム指定可能。値に list/tuple/set を渡すと IN 条件になります。

        :param key: グルーピングするKeyを指定するlambda
        :param kwargs: 検索対象のカラム名と値のマッピング
        :return: 該当レコードのリスト（Pydanticスキーマ形式）
        """
        arr = await self._find_by_fields(**kwargs)
        grouped: dict[K, list[ReadSchemaType]] = defaultdict(list)

        for x in arr:
            group_key = key(x)
            grouped[group_key].append(x)

        return grouped

    async def create(self, create_obj: CreateSchemaType, autocommit=True) -> ReadSchemaType:
        """
        新規レコードを作成します。

        :param create_obj: Pydanticスキーマに基づく作成オブジェクト
        :param autocommit: メソッド内でコミットするか
        :return: 作成されたレコード
        """
        db_obj = create_obj.to_entity(self.model)
        self.db.add(db_obj)
        if autocommit:
            await self.db.commit()
        await self.db.flush()
        await self.db.refresh(db_obj)
        return self.read_schema.from_entity(db_obj)

    async def create_many(self, create_obj_list: list[CreateSchemaType], autocommit=True) -> int:
        """
        新規レコードの一括作成します。

        :param create_obj_list: Pydanticスキーマに基づく作成オブジェクトのリスト
        :param autocommit: メソッド内でコミットするか
        :return: 作成されたレコードの件数
        """
        if not create_obj_list:
            return 0
        rows = [create_obj.to_entity(self.model).__dict__ for create_obj in create_obj_list]
        await self.db.execute(insert(self.model), rows)
        if autocommit:
            await self.db.commit()

        return len(rows)

    async def update(self, id: uuid.UUID, update_obj: UpdateSchemaType, autocommit=True) -> Optional[ReadSchemaType]:
        """
        IDに基づいて既存レコードを更新します。

        :param id: 対象レコードのUUID
        :param update_obj: Pydanticスキーマに基づく更新オブジェクト
        :param autocommit: メソッド内でコミットするか
        :return: 更新後のレコード、存在しない場合はNone
        """
        db_obj = await self._get(id)
        if not db_obj:
            return None

        db_obj = update_obj.apply_to(db_obj)
        if autocommit:
            await self.db.commit()
        await self.db.flush()
        await self.db.refresh(db_obj)
        return self.read_schema.from_entity(db_obj)

    async def delete(self, id: uuid.UUID, autocommit=True) -> bool:
        """
        指定IDのレコードを物理削除します。

        :param id: 対象レコードのUUID
        :param autocommit: メソッド内でコミットするか
        :return: 物理削除が成功したか
        """
        db_obj = await self._get(id)
        if not db_obj:
            return False

        await self.db.delete(db_obj)
        if autocommit:
            await self.db.commit()
        return True

    async def _delete_by_fields(self, autocommit=True, **kwargs: Any) -> int:
        stmt = delete(self.model)
        for field_name, value in kwargs.items():
            column = getattr(self.model, field_name, None)
            if column is not None:
                if isinstance(value, Iterable) and not isinstance(value, (str, bytes)):
                    stmt = stmt.where(column.in_(value))
                else:
                    stmt = stmt.where(column == value)
        result = await self.db.execute(stmt)
        if autocommit:
            await self.db.commit()
        return result.rowcount

    async def _get(self, id: uuid.UUID) -> ModelType | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()


class LogicalDeleteDao(BasicDao[LogicalDeleteModelType, CreateSchemaType, UpdateSchemaType, ReadSchemaType]):
    """
    論理削除に対応した非同期のDB操作の基底クラス。
    **継承したクラスで使いたいメソッドのテストを書くこと**

    :param db: 非同期SQLAlchemyセッション
    :param model: SQLAlchemyのモデルクラス（BaseSchemaを継承）
    :param read_schema: レスポンス用のPydanticスキーマクラス
    """

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

    async def soft_delete(self, id: uuid.UUID, autocommit=True) -> bool:
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

    async def hard_delete(self, id: uuid.UUID, autocommit=True) -> bool:
        """
        指定IDのレコードを物理削除します。

        :param id: 対象レコードのUUID
        :param autocommit: メソッド内でコミットするか
        :return: 物理削除が成功したか
        """
        return await self.delete(id, autocommit)

    async def _get(self, id: uuid.UUID) -> LogicalDeleteModelType | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id, self.model.deleted_at.is_(None)))
        return result.scalars().first()