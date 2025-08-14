import os
import sys

# テスト用の最低限の環境変数をセット（app import より前！）
os.environ.setdefault("SECRET_KEY", "test-secret")
# 例: SQLite を使う（依存注入で後から別DBに差し替えるなら何でもOK）
os.environ.setdefault("SQLALCHEMY_DATABASE_URL", "postgresql://sorasakamoto:password@localhost:5432/fleamarket")

app_dir = os.path.join(os.path.dirname(__file__), "..")
sys.path.append(app_dir)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import Session, sessionmaker
from backend.models import Base, Category
from backend.schemas.auth import DecodedToken
from backend.main import app
from database import get_db
from backend.cruds.auth_crud import get_current_user

@pytest.fixture()
def session_fixture():
    engine = create_engine(
        url="postgresql://sorasakamoto:password@localhost:5432/fleamarket",
        # connect_args={"check_same_thread": False}, 
        poolclass=StaticPool
    )
    Base.metadata.create_all(engine)

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # item1 = Category(name="PC1", user_id=1)
        # item2 = Category(name="PC2", user_id=1)
        # db.add(item1)
        # db.add(item2)
        # db.commit()
        yield db
    finally:
        db.close()


@pytest.fixture()
def user_fixture():
    return DecodedToken(username="user1", user_id=1)

@pytest.fixture()
def client_fixture(session_fixture: Session, user_fixture: DecodedToken):
    def override_get_db():
        return session_fixture

    def override_get_current_user():
        return user_fixture

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    client = TestClient(app)
    yield client

    print(app)
    app.dependency_overrides.clear()
