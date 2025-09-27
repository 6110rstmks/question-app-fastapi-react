import os
import pytest_asyncio

os.environ["SQLALCHEMY_DATABASE_URL"] = "postgresql+asyncpg://sora.sakamoto:password@localhost:5432/test_db"


from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from src.lib.database import SqlAlchemyBase

def add_async_schema(url: str) -> str:
    return url.replace("postgresql://", "postgresql+asyncpg://")

@pytest_asyncio.fixture(scope="function")
async def test_db():
    SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://sora.sakamoto:password@localhost:5432/test_db"
    async_engine = create_async_engine(add_async_schema(SQLALCHEMY_DATABASE_URL))

    async with async_engine.begin() as conn:
        await conn.run_sync(SqlAlchemyBase.metadata.create_all)

    yield async_engine

    async with async_engine.begin() as conn:
        await conn.run_sync(
            lambda sync_conn: [
                sync_conn.execute(table.delete()) for table in reversed(SqlAlchemyBase.metadata.sorted_tables)
            ]
        )

    await async_engine.dispose()

@pytest_asyncio.fixture(scope="function")
async def db(test_db):
    async with AsyncSession(test_db, expire_on_commit=False) as session:
        yield session
