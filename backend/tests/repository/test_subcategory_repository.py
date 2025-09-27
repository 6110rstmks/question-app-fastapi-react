import pytest
import pytest_asyncio

from sqlalchemy.ext.asyncio import AsyncSession

from backend.tests.repository.base_test import BasicDaoTest
from src.repository.subcategory_repository import SubcategoryRepository, SubcategoryCreate, SubcategoryUpdate

class TestSubcategoryRepository(BasicDaoTest):
    @pytest_asyncio.fixture
    async def dao(self, db: AsyncSession):
        return SubcategoryRepository(db)

    @pytest_asyncio.fixture
    async def create_dto(self):
        return SubcategoryCreate(name="subcategory1", category_id=1)
    
    @pytest_asyncio.fixture
    async def update_dto(self):
        return SubcategoryUpdate(name="updated_subcategory", category_id=1)
    
    @pytest.mark.asyncio
    async def find_by_category_id(self, dao: SubcategoryRepository, create_dto: SubcategoryCreate):
        obj = await dao.create(create_dto)
        
        actual = await dao.find_by_category_id(1)

        assert actual
        self.assert_objs(actual, [obj])
        
    # @pytest.mark.asyncio
    # async def test_find_by_name_like(self, dao: SubcategoryRepository, create_dto: SubcategoryCreate):
    #     obj = await dao.create(create_dto)
        
    #     actual = await dao.find_by_name_like("subcategory%")

    #     assert actual
    #     self.assert_objs(actual, [obj])
        
    @pytest.mark.asyncio
    async def test_find_by_name_contains(self, dao: SubcategoryRepository, create_dto: SubcategoryCreate):
        obj = await dao.create(create_dto)
        
        actual = await dao.find_by_name_contains("tegor")

        assert actual
        self.assert_objs(actual, [obj])
        
    @pytest.mark.asyncio
    async def find_by_name_starts_with(self, dao: SubcategoryRepository, create_dto: SubcategoryCreate):
        obj = await dao.create(create_dto)

        actual = await dao.find_by_name_starts_with("subcategory%")

        assert actual
        self.assert_objs(actual, [obj])
        
    @pytest.mark.asyncio
    async def find_by_category_id_and_name_like(self, dao: SubcategoryRepository, create_dto: SubcategoryCreate):
        obj = await dao.create(create_dto)

        actual = await dao.find_by_category_id_and_name_like(1, "subcategory%")

        assert actual
        self.assert_objs(actual, [obj])
    
    
