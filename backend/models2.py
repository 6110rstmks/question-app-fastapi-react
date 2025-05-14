from __future__ import annotations
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import relationship
from sqlalchemy import Column
from sqlalchemy import String, Enum
from sqlalchemy import DateTime
from sqlalchemy import Boolean
from sqlalchemy import ARRAY
from sqlalchemy import Date
from datetime import datetime
from sqlalchemy.sql import func
from schemas.question import SolutionStatus

class Base(DeclarativeBase):
    pass

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    pinned_order = Column(Integer)
    user = relationship("User", back_populates="categories")
    subcategories = relationship("Subcategory", back_populates="category")
    questions = relationship("CategoryQuestion", back_populates="category")
    
class Subcategory(Base):
    __tablename__ = "subcategories"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())
    category_id = Column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )

    # category = relationship("Category", back_populates="subcategory")
    # ↓なぜsubcategoriesと複数形なのか
    category = relationship("Category", back_populates="subcategories")
    questions = relationship("SubcategoryQuestion", back_populates="subcategory")
    
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    problem = Column(String, nullable=False)
    answer = Column(ARRAY(String), nullable=False)
    memo = Column(String)
    is_correct = Column(Enum(SolutionStatus), nullable=False, default=SolutionStatus.Incorrect)

    # これに変更する予定。実装難易度高いので保留
    # solved_status = Column(Enum(SolutionStatus), nullable=False, default=SolutionStatus.Incorrect)
    answer_count = Column(Integer, nullable=False, default=0)
    last_answered_date = Column(Date, default=func.current_date())
    
    subcategories = relationship("SubcategoryQuestion", back_populates="question")
    categories = relationship("CategoryQuestion", back_populates="question")
    
class SubcategoryQuestion(Base):
    __tablename__ = "subcategory_question"
    subcategory_id = Column(
        Integer, ForeignKey("subcategories.id", ondelete="CASCADE"), primary_key=True
    )
    question_id = Column(
        Integer, ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True
    )
    subcategory = relationship("Subcategory", back_populates="questions")
    question = relationship("Question", back_populates="subcategories")
    
class CategoryQuestion(Base): 
        
    __tablename__ = "category_question"
    category_id = Column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True
    )
    question_id = Column(
        Integer, ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True
    )
    category = relationship("Category", back_populates="questions")
    question = relationship("Question", back_populates="categories")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

    categories = relationship("Category", back_populates="user")

class AnswerLogs(Base):
    __tablename__ = "answer_logs"

    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, nullable=False)
    subcategory_id = Column(Integer, nullable=False)
    question_id = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    date = Column(Date, default=func.current_date())    
    