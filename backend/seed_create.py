from sqlalchemy.orm import sessionmaker, declarative_base
from config import get_settings
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, TIMESTAMP, ForeignKey, Table, ARRAY, func, create_engine
)

# データベース接続設定
SQLALCHEMY_DATABASE_URL = get_settings().sqlalchemy_database_url
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Baseクラスの定義
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

# Categories テーブル
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

# Subcategories テーブル
class Subcategory(Base):
    __tablename__ = "subcategories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)

# Questions テーブル
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    problem = Column(String, nullable=False)
    answer = Column(ARRAY(Text), nullable=False)  # 配列型のカラム
    memo = Column(String, nullable=False)
    is_correct = Column(Boolean, server_default="false", nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

# subcategory_question（中間テーブル）
subcategory_question_table = Table(
    "subcategory_question", Base.metadata,
    Column("subcategory_id", Integer, ForeignKey("subcategories.id", ondelete="CASCADE"), primary_key=True),
    Column("question_id", Integer, ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True)
)

# category_question（中間テーブル）
category_question2_table = Table(
    "category_question", Base.metadata,
    Column("category_id", Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
    Column("question_id", Integer, ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True)
)

# テーブル作成
Base.metadata.create_all(engine)