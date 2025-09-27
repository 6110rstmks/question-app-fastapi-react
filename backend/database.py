from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import sessionmaker
from config import get_settings
from fastapi import Depends

def add_async_schema(url: str) -> str:
    return url.replace("postgresql://", "postgresql+asyncpg://")

SQLALCHEMY_DATABASE_URL = get_settings().sqlalchemy_database_url

engine = create_engine(SQLALCHEMY_DATABASE_URL)

async_engine = create_async_engine(add_async_schema(SQLALCHEMY_DATABASE_URL))

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

AsyncSessionLocal = async_sessionmaker(bind=async_engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
async def get_session():
    async with AsyncSessionLocal() as session:
        yield session
        
SessionDependency = Depends(get_session)
