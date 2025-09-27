import pytest
import pytest_asyncio
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from backend.tests.repository.base_test import BasicDaoTest
from src.repository.question_repository import QuestionRepository, QuestionCreate, QuestionUpdate

class TestQuestionRepository(BasicDaoTest):
    @pytest_asyncio.fixture
    async def dao(self, db: AsyncSession):
        return QuestionRepository(db)

    @pytest_asyncio.fixture
    async def create_dto(self):
        return QuestionCreate(problem="What is Python?", answer=["Python is a programming language."], memo="A basic question about Python.", last_answered_date=date.today())
    
    @pytest_asyncio.fixture
    async def update_dto(self):
        return QuestionUpdate(
            problem="What is Python?", 
            answer=["Python is a popular programming language."], 
            memo="Updated memo.", 
            is_correct=1, 
            last_answered_date=date.today(), 
            answer_count=5
        )
    
   