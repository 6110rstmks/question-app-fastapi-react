from sqlalchemy.orm import Session
from sqlalchemy import select
from schemas.category import CategoryCreate
from models import Category, CategoryQuestion
from fastapi_pagination import Page, add_pagination, paginate
from sqlalchemy import func



def find_all(db: Session):
    query = select(Category)
    
    # デバッグ方法。
    # results = db.execute(query).scalars().all()
    # for aa in results:
    #     print(aa.name)
    return db.execute(query).scalars().all()

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
    new_category = Category(**category_create.model_dump(), user_id=1)
    # new_category = Category(**category_create.model_dump())
    db.add(new_category)
    db.commit()
    return new_category

# ページネーション
def get_page_count(db: Session):

    count_page = db.scalar(
                    select(func.count()).
                    select_from(Category)
                )
    count_page = count_page // 7 + 1
    print(count_page)
    return count_page

# 問題を一つ持つカテゴリを取得する。
def find_all_categories_with_questions(db: Session):
    query1 = select(CategoryQuestion.category_id).distinct()
    category_ids = db.execute(query1).scalars().all()
    
    query2 = select(Category).where(Category.id.in_(category_ids))
    return db.execute(query2).scalars().all()

