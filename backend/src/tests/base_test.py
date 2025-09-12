from datetime import datetime
import uuid
from datetime import datetime, timezone

import pytest

from src.repository.base import BaseCreateDTO, BaseReadDTO, BaseUpdateDTO, BasicDao, LogicalDeleteDao
from common.repository.composite_base import CompositeKeyDao


class BasicDaoTest:
    def assert_objs(self, actual: list[BaseReadDTO], expected: list[BaseReadDTO]):
        assert len(actual) == len(expected)
        assert set(map(frozenset, map(dict.items, [x.model_dump() for x in actual]))) == set(
            map(frozenset, map(dict.items, [x.model_dump() for x in expected]))
        )

    def assert_obj(self, actual: BaseReadDTO, expected: BaseReadDTO):
        for k, v in expected.model_dump().items():
            actual_value = getattr(actual, k)
            if isinstance(v, datetime) and isinstance(actual_value, datetime):
                assert actual_value.replace(microsecond=0) == v.replace(microsecond=0), f"{k}: {actual_value} != {v}"
            else:
                assert actual_value == v, f"{k}: {actual_value} != {v}"

    @pytest.fixture(name="create_dtos")
    async def _create_dtos(self, create_dto: BaseCreateDTO):
        return [create_dto for _ in range(3)]

    @pytest.mark.asyncio
    async def test_create_and_get(self, dao: BasicDao, create_dto: BaseCreateDTO):
        obj = await dao.create(create_dto)
        actual = await dao.get(obj.id)

        assert actual
        self.assert_obj(actual, obj)

    @pytest.mark.asyncio
    async def test_create_many(self, dao: BasicDao, create_dtos: list[BaseCreateDTO]):
        actual = await dao.create_many(create_dtos)
        objs = await dao.get_all()
        assert len(objs) == actual

    @pytest.mark.asyncio
    async def test_create_many_with_empty_list(self, dao: BasicDao):
        actual = await dao.create_many([])
        assert actual == 0

    @pytest.mark.asyncio
    async def test_get_with_invalid_id(self, dao: LogicalDeleteDao, create_dto: BaseCreateDTO):
        await dao.create(create_dto)

        actual = await dao.get(uuid.uuid4())

        assert actual is None

    @pytest.mark.asyncio
    async def test_get_all(self, dao: BasicDao, create_dtos: list[BaseCreateDTO]):
        obj_1 = await dao.create(create_dtos[0])
        obj_2 = await dao.create(create_dtos[1])
        obj_3 = await dao.create(create_dtos[2])

        result = await dao.get_all()

        self.assert_objs(result, [obj_1, obj_2, obj_3])

    @pytest.mark.asyncio
    async def test_get_all_without_data(self, dao: BasicDao):
        result = await dao.get_all()

        assert len(result) == 0

    @pytest.mark.asyncio
    async def test_find_by_ids(self, dao: BasicDao, create_dtos: list[BaseCreateDTO]):
        obj_1 = await dao.create(create_dtos[0])
        obj_2 = await dao.create(create_dtos[1])
        await dao.create(create_dtos[2])

        actual = await dao.find_by_ids([obj_1.id, obj_2.id])

        self.assert_objs(actual, [obj_1, obj_2])

    @pytest.mark.asyncio
    async def test_update(self, dao: BasicDao, create_dto: BaseCreateDTO, update_dto: BaseUpdateDTO):
        created = await dao.create(create_dto)
        updated = await dao.update(created.id, update_dto)
        assert updated
        for k, v in update_dto.model_dump().items():
            assert getattr(updated, k) == v
        actual = await dao.get(created.id)
        assert actual
        self.assert_obj(actual, updated)

    @pytest.mark.asyncio
    async def test_delete(self, dao: BasicDao, create_dto: BaseCreateDTO):
        obj = await dao.create(create_dto)
        assert await dao.delete(obj.id)
        after_delete = await dao.get(obj.id)
        assert after_delete is None


class LogicalDeleteDaoTest:
    def assert_objs(self, actual: list[BaseReadDTO], expected: list[BaseReadDTO]):
        assert len(actual) == len(expected)
        assert set(map(frozenset, map(dict.items, [x.model_dump() for x in actual]))) == set(
            map(frozenset, map(dict.items, [x.model_dump() for x in expected]))
        )

    def assert_obj(self, actual: BaseReadDTO, expected: BaseReadDTO):
        for k, v in expected.model_dump().items():
            assert getattr(actual, k) == v

    @pytest.fixture(name="create_dtos")
    async def _create_dtos(self, create_dto: BaseCreateDTO):
        return [create_dto for _ in range(3)]

    @pytest.mark.asyncio
    async def test_create_and_get(self, dao: LogicalDeleteDao, create_dto: BaseCreateDTO):
        obj = await dao.create(create_dto)
        actual = await dao.get(obj.id)

        assert actual
        self.assert_obj(actual, obj)
        for k, v in create_dto.model_dump().items():
            if isinstance(v, datetime) and isinstance(getattr(actual, k), datetime):
                assert getattr(actual, k).replace(microsecond=0, tzinfo=timezone.utc) == v.replace(microsecond=0), (
                    f"{k}: {getattr(actual, k)} != {v}"
                )
            else:
                assert getattr(actual, k) == v
            if isinstance(v, datetime) and isinstance(getattr(actual, k), datetime):
                assert getattr(actual, k).replace(microsecond=0, tzinfo=timezone.utc) == v.replace(microsecond=0), (
                    f"{k}: {getattr(actual, k)} != {v}"
                )
            else:
                assert getattr(actual, k) == v

    @pytest.mark.asyncio
    async def test_create_many(self, dao: BasicDao, create_dtos: list[BaseCreateDTO]):
        actual = await dao.create_many(create_dtos)
        objs = await dao.get_all()
        assert len(objs) == actual

    @pytest.mark.asyncio
    async def test_get_with_soft_deleted(self, dao: LogicalDeleteDao, create_dto: BaseCreateDTO):
        obj = await dao.create(create_dto)
        await dao.soft_delete(obj.id)
        actual = await dao.get(obj.id)

        assert actual is None

    @pytest.mark.asyncio
    async def test_get_with_invalid_id(self, dao: LogicalDeleteDao, create_dto: BaseCreateDTO):
        await dao.create(create_dto)

        actual = await dao.get(uuid.uuid4())

        assert actual is None

    @pytest.mark.asyncio
    async def test_get_all(self, dao: LogicalDeleteDao, create_dtos: list[BaseCreateDTO]):
        obj_1 = await dao.create(create_dtos[0])
        obj_2 = await dao.create(create_dtos[1])
        soft_deleted = await dao.create(create_dtos[2])
        await dao.soft_delete(soft_deleted.id)

        result = await dao.get_all()

        self.assert_objs(result, [obj_1, obj_2])

    @pytest.mark.asyncio
    async def test_get_all_without_data(self, dao: LogicalDeleteDao):
        result = await dao.get_all()

        assert len(result) == 0

    @pytest.mark.asyncio
    async def test_find_by_ids(self, dao: LogicalDeleteDao, create_dtos: list[BaseCreateDTO]):
        obj_1 = await dao.create(create_dtos[0])
        obj_2 = await dao.create(create_dtos[1])
        soft_deleted = await dao.create(create_dtos[2])
        await dao.soft_delete(soft_deleted.id)

        actual = await dao.find_by_ids([obj_1.id, obj_2.id, soft_deleted.id])

        self.assert_objs(actual, [obj_1, obj_2])

    @pytest.mark.asyncio
    async def test_update(self, dao: LogicalDeleteDao, create_dto: BaseCreateDTO, update_dto: BaseUpdateDTO):
        created = await dao.create(create_dto)
        updated = await dao.update(created.id, update_dto)
        assert updated
        for k, v in update_dto.model_dump().items():
            assert getattr(updated, k) == v
        actual = await dao.get(created.id)
        assert actual
        self.assert_obj(actual, updated)

    @pytest.mark.asyncio
    async def test_update_with_soft_deleted(
        self, dao: LogicalDeleteDao, create_dto: BaseCreateDTO, update_dto: BaseUpdateDTO
    ):
        created = await dao.create(create_dto)
        await dao.soft_delete(created.id)
        updated = await dao.update(created.id, update_dto)
        assert updated is None

    @pytest.mark.asyncio
    async def test_soft_delete(self, dao: LogicalDeleteDao, create_dto: BaseCreateDTO):
        obj = await dao.create(create_dto)
        assert await dao.soft_delete(obj.id)
        deleted = await dao.get(obj.id)
        assert deleted is None

    @pytest.mark.asyncio
    async def test_hard_delete(self, dao: LogicalDeleteDao, create_dto: BaseCreateDTO):
        obj = await dao.create(create_dto)
        assert await dao.hard_delete(obj.id)
        after_delete = await dao._find_by_fields(id=obj.id, include_deleted=True)
        assert len(after_delete) == 0


class CompositeKeyDaoTest:
    def assert_obj(self, actual, expected):
        for k, v in expected.model_dump().items():
            assert getattr(actual, k) == v

    @pytest.mark.asyncio
    async def test_create_and_get(self, dao: CompositeKeyDao, create_dto: BaseCreateDTO):
        obj = await dao.create(create_dto)
        actual = await dao.get(**create_dto.model_dump())

        assert actual
        self.assert_obj(actual, obj)
        for k, v in create_dto.model_dump().items():
            assert getattr(actual, k) == v

    @pytest.mark.asyncio
    async def test_create_many(self, dao: CompositeKeyDao, create_dtos: list[BaseCreateDTO]):
        actual = await dao.create_many(create_dtos)
        assert actual == 3
        for create_dto in create_dtos:
            actual = await dao.get(**create_dto.model_dump())

            assert actual
            for k, v in create_dto.model_dump().items():
                assert getattr(actual, k) == v

    @pytest.mark.asyncio
    async def test_create_many_with_empty_list(self, dao: CompositeKeyDao):
        actual = await dao.create_many([])
        assert actual == 0

    @pytest.mark.asyncio
    async def test_delete(self, dao: CompositeKeyDao, create_dto: BaseCreateDTO):
        await dao.create(create_dto)
        assert await dao.delete(**create_dto.model_dump())
        actual = await dao.get(**create_dto.model_dump())

        assert actual is None