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
    
    @pytest.mark.asyncio
    async def test_find_by_name_contains(self, dao: CategoryRepository, create_dto: CategoryCreate):
        obj = await dao.create(create_dto)
        
        actual = await dao.find_by_name_contains("category1")

        assert actual
        self.assert_objs(actual, [obj])
        
    @pytest.mark.asyncio
    async def test_find_by_name_starts_with(self, dao: CategoryRepository, create_dto: CategoryCreate):
        obj = await dao.create(create_dto)
        
        actual = await dao.find_by_name_starts_with("cat")

        assert actual
        self.assert_objs(actual, [obj])
        
    
    @pytest.mark.asyncio
    async def test_check_name_exists(self, dao: CategoryRepository, create_dto: CategoryCreate):
        await dao.create(create_dto)

        flg_true = await dao.check_name_exists("category1")
        flg_false = await dao.check_name_exists("nonexistent")

        assert flg_true is True
        assert flg_false is False

    @pytest.mark.asyncio
    async def test_count_all(self, dao: CategoryRepository, create_dto: CategoryCreate):
        await dao.create(create_dto)
        await dao.create(CategoryCreate(name="category2", user_id=1))

        total_count = await dao.count_all()

        assert total_count == 2
    
        