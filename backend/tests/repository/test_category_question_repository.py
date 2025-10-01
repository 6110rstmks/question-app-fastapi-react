from backend.tests.repository.composite_dao_key_test import CompositeKeyDaoTest
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from src.repository.category_question_repository import CategoryQuestionRepository, CategoryQuestionCreate, CategoryQuestionUpdate

class TestCategoryQuestionRepository(CompositeKeyDaoTest):
    @pytest_asyncio.fixture
    async def dao(self, db: AsyncSession):
        return CategoryQuestionRepository(db)
    
    @pytest_asyncio.fixture
    async def create_dto(self):
        return CategoryQuestionCreate(category_id=1, question_id=1)
    
    @pytest_asyncio.fixture
    async def update_dto(self):
        return CategoryQuestionUpdate()
    
    @pytest.mark.asyncio
    async def test_find_by_category_id(
        self, 
        dao: CategoryQuestionRepository, 
        create_dto: CategoryQuestionCreate
    ):
        obj = await dao.create(create_dto)
        
        actual = await dao.find_by_category_id(1)

        assert actual
        self.assert_objs(actual, [obj])
        
    @pytest.mark.asyncio
    async def test_find_by_question_id(
        self, 
        dao: CategoryQuestionRepository, 
        create_dto: CategoryQuestionCreate
    ):
        obj = await dao.create(create_dto)
        
        actual = await dao.find_by_question_id(1)

        assert actual
        self.assert_objs(actual, [obj])