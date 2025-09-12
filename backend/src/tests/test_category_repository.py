import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.tests.base_test import BasicDaoTest
from backend.src.repository.category_repository import CategoryRepository, CategoryCreate

class TestCategoryRepository(BasicDaoTest):
    @pytest.fixture
    async def dao(self, db: AsyncSession):
        return CategoryRepository(db)

    async def create_dto(self, dao: CategoryRepository):
        return CategoryCreate(name="category1")