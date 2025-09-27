import os
import sys

# テスト用の最低限の環境変数をセット（app import より前！）
os.environ.setdefault("SECRET_KEY", "test-secret")

os.environ["SQLALCHEMY_DATABASE_URL"] = "postgresql+asyncpg://sorasakamoto:password@localhost:5432/test_db"


app_dir = os.path.join(os.path.dirname(__file__), "..")
sys.path.append(app_dir)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from models import Base
from schemas.auth import DecodedToken
from main import app
from database import add_async_schema, get_session
from cruds.auth_crud import get_current_user
from config import get_settings
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker


@pytest.fixture()
async def session_fixture():
    SQLALCHEMY_DATABASE_URL = get_settings().sqlalchemy_database_url

    async_engine = create_async_engine(add_async_schema(SQLALCHEMY_DATABASE_URL))

    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    AsyncSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=async_engine)
    db = AsyncSessionLocal()

    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def user_fixture():
    return DecodedToken(username="user1", user_id=1)

@pytest.fixture()
def client_fixture(session_fixture: AsyncSession, user_fixture: DecodedToken):
    def override_get_db():
        return session_fixture

    def override_get_current_user():
        return user_fixture

    app.dependency_overrides[get_session] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    client = TestClient(app)
    yield client

    app.dependency_overrides.clear()
    