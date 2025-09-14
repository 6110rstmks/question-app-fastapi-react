from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Date, Integer, Enum
from sqlalchemy.sql import func
from datetime import date


from src.repository.base.LogicalDeleteDao import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao
from schemas.question import SolutionStatus


class QuestionSchema(IdSchema):
    __tablename__ = "questions"

    problem = mapped_column(String, nullable=False)
    answer = mapped_column(String)
    memo = mapped_column(String)
    is_correct = mapped_column(Enum(SolutionStatus), default=SolutionStatus.Incorrect)
    answer_count = mapped_column(Integer, default=0)
    last_answered_date = mapped_column(Date, default=func.current_date())


class QuestionCreate(BaseCreateDTO):
    problem: str
    answer: str
    memo: str
    is_correct: SolutionStatus

class QuestionUpdate(BaseUpdateDTO):
    problem: str | None = None
    answer: str | None = None
    memo: str | None = None
    is_correct: SolutionStatus | None = None
    answer_count: int | None = None

class QuestionRead(BaseReadDTO):
    id: int
    problem: str
    answer: str
    memo: str
    is_correct: SolutionStatus
    answer_count: int
    last_answered_date: date | None = None

class QuestionRepository(
    BasicDao[QuestionSchema, QuestionCreate, QuestionUpdate, QuestionRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, QuestionSchema, QuestionRead)

    async def find_by_problem_starts_with(self, problem: str) -> list[QuestionRead]:
        return await self._find_by_field(like_fields={"problem": f"{problem}%"})

    
