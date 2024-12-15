from sqlalchemy.orm import Session
from sqlalchemy import select, func
from schemas.category import CategoryCreate
from models import Category, CategoryQuestion
from config import PAGE_SIZE
from fastapi import HTTPException

def find_all(db: Session, skip: int = 0, limit: int = 10, word: str = None):

    # カテゴリテーブルがそんざいするかどうかの確認。
    # なければreturn Noneとする。
    if not db.query(Category).first():
        return None  
    
    # query = select(Category)
    
    # # デバッグ方法。
    # # results = db.execute(query).scalars().all()
    # # for aa in results:
    # #     print(aa.name)
    # return db.execute(query).scalars().all()
    
    query_stmt = select(Category)
    
    # 検索クエリがある場合はフィルタリング
    if word:
        query_stmt = query_stmt.where(Category.name.istartswith(f"%{word}%"))

    # 結果を取得してスキップとリミットを適用
    result = db.execute(query_stmt).scalars().all()
    return result[skip: skip + limit]

def find_pagination(db: Session):
    query = select(Category)
    return db.execute(query).scalars().all()

def find_by_id(db: Session, id: int):
    query = select(Category).where(Category.id == id)
    return db.execute(query).scalars().first()

def find_by_name(db: Session, name: str):
    # return db.query(Category).filter(Category.name.like(f"%{name}%")).all()
    query = select(Category).where(Category.name.like(f"%{name}%"))
    return db.execute(query).scalars().all()

# def create(db: Session, category_create: category.CategoryCreate, user_id: int):
def create(db: Session, category_create: CategoryCreate):
    
    # case insensitiveとする。
    existing_category = (
        db.query(Category)
        .filter(func.lower(Category.name) == func.lower(category_create.name))
        .first()
    )
    
    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists.")

    new_category = Category(**category_create.model_dump(), user_id=1)
    
    db.add(new_category)
    db.commit()
    return new_category

# ページネーション
def get_page_count(db: Session):

    count_page = db.scalar(
                    select(func.count()).
                    select_from(Category)
                )
    count_page = count_page // PAGE_SIZE + 1
    return count_page

# Questionを一つでも持つCategoryをすべて取得する。
# Problem生成画面にて、Categoryを選択する際に使用する。
def find_all_categories_with_questions(db: Session):
    query1 = select(CategoryQuestion.category_id).distinct()
    category_ids = db.execute(query1).scalars().all()
    
    query2 = select(Category).where(Category.id.in_(category_ids))
    return db.execute(query2).scalars().all()