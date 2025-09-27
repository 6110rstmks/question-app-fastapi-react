import pytest
import pytest_asyncio

from sqlalchemy.ext.asyncio import AsyncSession

from backend.tests.repository.base_test import BasicDaoTest
from src.repository.category_repository import CategoryRepository, CategoryCreate, CategoryUpdate

class TestCategoryRepository(BasicDaoTest):
    @pytest_asyncio.fixture
    async def dao(self, db: AsyncSession):
        return CategoryRepository(db)

    @pytest_asyncio.fixture
    async def create_dto(self):
        return CategoryCreate(name="category1", user_id=1)
    
    @pytest_asyncio.fixture
    async def update_dto(self):
        return CategoryUpdate(name="updated_category")
    
    