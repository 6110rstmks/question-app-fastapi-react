from sqlalchemy.orm import Session
from sqlalchemy import select, func
from schemas.category import CategoryCreate
from models import Category, CategoryQuestion, Subcategory
from config import PAGE_SIZE
from fastapi import HTTPException

def find_all(db: Session, limit: int, skip: int = 0,  category_word: str = None, subcategory_word: str = None):

    # カテゴリテーブルがそんざいするかどうかの確認。
    # テーブルの存在確認を行う理由はデフォルトでは。
    if not db.query(Category).first():
        return None  
        
    # # デバッグ方法。
    # # results = db.execute(query).scalars().all()
    # # for aa in results:
    # #     print(aa.name)
    # return db.execute(query).scalars().all()
    
    query_stmt = select(Category)
    
    # Category欄で検索した場合
    if category_word:
        query_stmt = query_stmt.where(Category.name.istartswith(f"%{category_word}%"))

    # Subcategory欄で検索した場合
    # そのSubcategoryを持つCategoryを取得するしてCategoriesで返す。
    if subcategory_word:
        query2 = select(Subcategory).where(Subcategory.name.istartswith(f"%{subcategory_word}%"))
        results = db.execute(query2).scalars().all()
        category_ids = [result.category_id for result in results]
        print("category_ids:", category_ids)
        query_stmt = query_stmt.where(Category.id.in_(category_ids))

    # 結果を取得してスキップとリミットを適用
    result = db.execute(query_stmt).scalars().all()
    return result[skip: skip + limit]

def find_pagination(db: Session):
    query = select(Category)
    return db.execute(query).scalars().all()

def find_category_by_id(db: Session, id: int):
    query = select(Category).where(Category.id == id)
    return db.execute(query).scalars().first()

def find_category_by_name(db: Session, name: str):
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
# def get_page_count(db: Session) -> int: 
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