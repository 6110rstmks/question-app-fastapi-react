from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Date, Integer, Enum, ARRAY
from sqlalchemy.sql import func
from datetime import date
from sqlalchemy import select, func
from pydantic import ConfigDict


from src.repository.base.LogicalDeleteDao import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao
from schemas.question import SolutionStatus


class QuestionSchema(IdSchema):
    __tablename__ = "questions"

    problem = mapped_column(String, nullable=False)
    answer = mapped_column(ARRAY(String))  # ← 配列に変更
    memo = mapped_column(String)
    is_correct = mapped_column(Enum(SolutionStatus), default=SolutionStatus.Incorrect)
    answer_count = mapped_column(Integer, default=0)
    last_answered_date = mapped_column(Date, default=func.current_date())


class QuestionCreate(BaseCreateDTO):
    problem: str
    answer: list[str]
    memo: str
    last_answered_date: date

class QuestionUpdate(BaseUpdateDTO):
    problem: str | None = None
    answer: list[str] | None = None
    memo: str | None = None
    is_correct: SolutionStatus | None = None
    answer_count: int | None = None
    last_answered_date: date | None = None

class QuestionRead(BaseReadDTO):
    id: int
    problem: str
    answer: list[str]
    memo: str
    is_correct: SolutionStatus
    answer_count: int
    last_answered_date: date | None = None
    
    model_config = ConfigDict(from_attributes=True)

class QuestionRepository(
    BasicDao[QuestionSchema, QuestionCreate, QuestionUpdate, QuestionRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, QuestionSchema, QuestionRead)

    async def find_by_problem_starts_with(self, problem: str) -> list[QuestionRead]:
        return await self._find_by_fields(like_fields={"problem": f"{problem}%"})

    async def find_by_problem_contains(self, keyword: str) -> list[QuestionRead]:
        return await self._find_by_fields(like_fields={"problem": f"%{keyword}%"})

    async def find_by_answer_contains(self, keyword: str) -> list[QuestionRead]:
        stmt = select(self.model).where(
            func.array_to_string(self.model.answer, ',').ilike(f"%{keyword}%")
        )
        result = await self.db.execute(stmt)
        entities = result.scalars().all()
        return [QuestionRead.model_validate(entity) for entity in entities]