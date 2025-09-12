from sqlalchemy.orm import DeclarativeBase


class SqlAlchemyBase(DeclarativeBase):
    pass


def add_sync_schema(url: str) -> str:
    return url.replace("postgresql://", "postgresql+psycopg2://")