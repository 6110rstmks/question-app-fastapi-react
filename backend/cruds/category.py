from sqlalchemy.orm import Session
from sqlalchemy import select
from schemas.category import CategoryCreate, CategoryImport
from models import Category, CategoryQuestion, SubCategory, Question, SubCategoryQuestion
from sqlalchemy import func
from config import PAGE_SIZE
import json
from fastapi import HTTPException, UploadFile



def find_all(db: Session, skip: int = 0, limit: int = 10, word: str = None):
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
    
    existing_category = db.query(Category).filter(Category.name == category_create.name).first()
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
    # count_page = count_page // 9 + 1
    count_page = count_page // PAGE_SIZE + 1
    print(count_page)
    return count_page

# 問題を一つ持つカテゴリを取得する。
def find_all_categories_with_questions(db: Session):
    query1 = select(CategoryQuestion.category_id).distinct()
    category_ids = db.execute(query1).scalars().all()
    
    query2 = select(Category).where(Category.id.in_(category_ids))
    return db.execute(query2).scalars().all()

# def export_to_json(db: Session, file_path):

#     query_stmt = select(Category)
    
#     categories = db.execute(query_stmt).scalars().all()
        
#     data = []
    
#     for category in categories:
#         category_data = {
#             "category_name": category.name,
#             "subcategories": []
#         }
        
#         for subcategory in category.subcategories:
#             subcategory_data = {
#                 "name": subcategory.name,
#                 "questions": []
#             }
#             for subcat_question in subcategory.questions:
#                 question = subcat_question.question
#                 subcategory_data["questions"].append({
#                     "problem": question.problem,
#                     "answer": question.answer,
#                     "is_correct": question.is_correct
#                 })
#             category_data["subcategories"].append(subcategory_data)
#         data.append(category_data)
    
#     with open(file_path, "w", encoding="utf-8") as jsonfile:
#         json.dump(data, jsonfile, indent=4, ensure_ascii=False)

def export_to_json(db: Session, file_path: str):
    query_stmt = select(Category)
    
    categories = db.execute(query_stmt).scalars().all()
        
    data = {
        "category": []  # "category"キーを最上位に追加
    }
    
    for category in categories:
        category_data = {
            "name": category.name,  # "category_name"を"name"に変更
            "subcategories": []
        }
        
        for subcategory in category.subcategories:
            subcategory_data = {
                "name": subcategory.name,
                "questions": []
            }
            for subcat_question in subcategory.questions:
                question = subcat_question.question
                subcategory_data["questions"].append({
                    "problem": question.problem,
                    "answer": question.answer,
                    "is_correct": question.is_correct
                })
            category_data["subcategories"].append(subcategory_data)
        data["category"].append(category_data)  # データを"category"キーに追加
    
    with open(file_path, "w", encoding="utf-8") as jsonfile:
        json.dump(data, jsonfile, indent=4, ensure_ascii=False)


async def import_json_file(db: Session, file: UploadFile):
    # Check file type
    if file.content_type != "application/json":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a JSON file.")

    # Parse the JSON file
    content = await file.read()
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format.")

    if "category" not in data or not isinstance(data["category"], list):
        raise HTTPException(status_code=400, detail="Invalid JSON structure. 'category' key is required.")

    # Process categories
    for category_data in data["category"]:
        category_name = category_data.get("name")
        
        if not category_name:
            raise HTTPException(status_code=400, detail="Category name is required.")
        
        if len(find_by_name(db, category_name)) > 0:
            continue

        # Create and add category
        category = Category(name=category_name, user_id=1)  # Adjust user_id as needed
        db.add(category)

        # Process subcategories
        subcategories = category_data.get("subcategories", [])
        for subcategory_data in subcategories:
            subcategory_name = subcategory_data.get("name")
            if not subcategory_name:
                raise HTTPException(status_code=400, detail="Subcategory name is required.")

            # Create and add subcategory
            subcategory = SubCategory(name=subcategory_name, category=category)
            db.add(subcategory)

            # Process questions
            questions = subcategory_data.get("questions", [])
            for question_data in questions:
                problem = question_data.get("problem")
                answer = question_data.get("answer", [])
                is_correct = question_data.get("is_correct", False)

                if not problem:
                    raise HTTPException(status_code=400, detail="Question problem is required.")

                # Create and add question
                question = Question(
                    problem=problem,
                    answer=answer,
                    is_correct=is_correct,
                )
                db.add(question)

                # Create SubCategoryQuestion link
                subcategory_question = SubCategoryQuestion(
                    subcategory=subcategory,
                    question=question,
                )
                db.add(subcategory_question)

                # Optionally, create a CategoryQuestion link
                category_question = CategoryQuestion(
                    category=category,
                    question=question,
                )
                db.add(category_question)

    # Commit the transaction
    db.commit()
    return {"message": "Data uploaded successfully"}