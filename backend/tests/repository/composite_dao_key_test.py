from datetime import datetime
import pytest

from src.repository.base.LogicalDeleteDao import BaseCreateDTO
from src.repository.base.composite_base import CompositeKeyDao


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