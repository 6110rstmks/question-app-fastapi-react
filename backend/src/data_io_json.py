
from sqlalchemy.orm import Session
from sqlalchemy import select
from models2 import Category, CategoryQuestion, Subcategory, Question, SubcategoryQuestion
import json
from fastapi import HTTPException, UploadFile
from cruds import category_crud as category_cruds


# 詳細はdocument/data_import_export.mdを参照
def export_to_json(db: Session, file_path: str):
    query_stmt = select(Category)
    
    categories = db.execute(query_stmt).scalars().all()
        
    data = {
        "category": []  # "category"キーを最上位に追加
    }
    
    for category in categories:
        category_data = {
            "name": category.name,
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
                    "memo": question.memo,
                    "is_correct": question.is_correct,
                    "last_answered_date": question.last_answered_date
                })
            category_data["subcategories"].append(subcategory_data)
        data["category"].append(category_data)  # データを"category"キーに追加
    
    with open(file_path, "w", encoding="utf-8") as jsonfile:
        json.dump(data, jsonfile, indent=4, ensure_ascii=False, default=str)
        
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
        
        if len(category_cruds.find_category_by_name(db, category_name)) > 0:
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
            subcategory = Subcategory(name=subcategory_name, category=category)
            db.add(subcategory)

            # Process questions
            questions = subcategory_data.get("questions", [])
            for question_data in questions:
                problem = question_data.get("problem")
                answer = question_data.get("answer", [])
                memo = question_data.get("memo")
                is_correct = question_data.get("is_correct", False)
                last_answered_date = question_data.get("last_answered_date")

                if not problem:
                    raise HTTPException(status_code=400, detail="Question problem is required.")

                # Create and add question
                question = Question(
                    problem=problem,
                    answer=answer,
                    memo=memo,
                    is_correct=is_correct,
                    last_answered_date=last_answered_date,
                )
                db.add(question)

                # Create SubcategoryQuestion link
                subcategory_question = SubcategoryQuestion(
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

