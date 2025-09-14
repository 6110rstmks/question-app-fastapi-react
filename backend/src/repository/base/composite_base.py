from sqlalchemy import select, insert, inspect, delete
from collections import defaultdict
from typing import TypeVar, Generic, Type, Optional, Any, Callable, Iterable
from sqlalchemy.ext.asyncio import AsyncSession

from src.repository.base.BasicDao import CreateSchemaType, UpdateSchemaType, ReadSchemaType, BaseSchema


class CompositeKeySchema(BaseSchema):
    __abstract__ = True


ModelType = TypeVar("ModelType", bound=CompositeKeySchema)
K = TypeVar("K")


class CompositeKeyDao(Generic[ModelType, CreateSchemaType, UpdateSchemaType, ReadSchemaType]):
    """
    複合主キーを操作する基底クラス。
    CRUD操作と論理削除を型安全に抽象化するためのジェネリックなDAOです。
    **継承したクラスで使いたいメソッドのテストを書くこと**

    :param db: 非同期SQLAlchemyセッション
    :param model: SQLAlchemyのモデルクラス（BaseSchemaを継承）
    :param read_schema: レスポンス用のPydanticスキーマクラス
    :param mapping_keys: 主キーのカラム名とスキーマクラスのフィールドのマッピング
    """

    def __init__(
        self,
        db: AsyncSession,
        model: Type[ModelType],
        read_schema: Type[ReadSchemaType],
        mapping_keys: dict[str, str] = {},
    ):
        self.db = db
        self.model = model
        self.read_schema = read_schema
        self.mapping_keys = mapping_keys

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

    async def get(self, **pk: Any) -> Optional[ReadSchemaType]:
        obj = await self._get(**pk)
        return self.read_schema.from_entity(obj) if obj else None

    async def _find_by_fields(self, **kwargs: Any) -> list[ReadSchemaType]:
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

    async def delete(self, autocommit=True, **pk: Any) -> bool:
        obj = await self._get(**pk)
        if not obj:
            return False
        await self.db.delete(obj)
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

    async def _get(self, **pk: Any) -> CompositeKeySchema | None:
        stmt = select(self.model)
        for key in self._detect_primary_keys():
            arg_pk_key = self.mapping_keys.get(key, key)
            stmt = stmt.where(getattr(self.model, key) == pk[arg_pk_key])
        result = await self.db.execute(stmt)
        return result.scalars().first()

    def _detect_primary_keys(self) -> list[str]:
        return [col.name for col in inspect(self.model).primary_key]