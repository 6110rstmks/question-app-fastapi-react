from sqlalchemy.orm import Session
from sqlalchemy import select
from models2 import Category, CategoryQuestion, Subcategory, Question, SubcategoryQuestion
import json
from fastapi import HTTPException, UploadFile
from cruds import category_crud as category_cruds

import csv
import os

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
                    "is_correct": question.is_correct
                })
            category_data["subcategories"].append(subcategory_data)
        data["category"].append(category_data)  # データを"category"キーに追加
    
    with open(file_path, "w", encoding="utf-8") as jsonfile:
        json.dump(data, jsonfile, indent=4, ensure_ascii=False)

def export_models_to_csv(db: Session, output_dir: str):
    """
    各モデルを別々のCSVファイルにエクスポートする関数
    1. categories.csv - カテゴリ情報
    2. subcategories.csv - サブカテゴリ情報
    3. questions.csv - 質問情報
    4. category_question.csv - カテゴリ・質問の関連
    5. subcategory_question.csv - サブカテゴリ・質問の関連
    """
    
    # # 出力ディレクトリが存在することを確認
    # os.makedirs(output_dir, exist_ok=True)
    
    # 1. カテゴリをエクスポート
    categories_path = os.path.join(output_dir, 'categories.csv')
    with open(categories_path, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['id', 'name', 'user_id'])
        
        categories = db.query(Category).all()
        for category in categories:
            csv_writer.writerow([
                category.id,
                category.name,
                category.user_id
            ])
    
    print(f"Categories exported to {categories_path}")
    
    # 2. サブカテゴリをエクスポート
    subcategories_path = os.path.join(output_dir, 'subcategories.csv')
    with open(subcategories_path, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['id', 'name', 'category_id', 'updated_at'])
        
        subcategories = db.query(Subcategory).all()
        for subcategory in subcategories:
            csv_writer.writerow([
                subcategory.id,
                subcategory.name,
                subcategory.category_id,
                subcategory.updated_at.isoformat() if subcategory.updated_at else ''
            ])
    
    print(f"Subcategories exported to {subcategories_path}")
    
    # # 3. 質問をエクスポート
    # questions_path = os.path.join(output_dir, 'questions.csv')
    # with open(questions_path, 'w', newline='', encoding='utf-8') as csvfile:
    #     csv_writer = csv.writer(csvfile)
    #     csv_writer.writerow(['id', 'problem', 'answer', 'memo', 'is_correct', 
    #                         'answer_count', 'last_answered_date'])
        
    #     questions = db.query(Question).all()
    #     for question in questions:
    #         # ARRAY型のanswerをCSV用に文字列に変換
    #         answer_str = ';'.join(question.answer) if question.answer else ''
            
    #         csv_writer.writerow([
    #             question.id,
    #             question.problem,
    #             answer_str,
    #             question.memo or '',
    #             question.is_correct,
    #             question.answer_count,
    #             question.last_answered_date.isoformat() if question.last_answered_date else ''
    #         ])
    
    # print(f"Questions exported to {questions_path}")
    
    # # 4. カテゴリ・質問の関連をエクスポート
    # category_question_path = os.path.join(output_dir, 'category_question.csv')
    # with open(category_question_path, 'w', newline='', encoding='utf-8') as csvfile:
    #     csv_writer = csv.writer(csvfile)
    #     csv_writer.writerow(['category_id', 'question_id'])
        
    #     category_questions = db.query(CategoryQuestion).all()
    #     for cq in category_questions:
    #         csv_writer.writerow([cq.category_id, cq.question_id])
    
    # print(f"CategoryQuestion relationships exported to {category_question_path}")
    
    # # 5. サブカテゴリ・質問の関連をエクスポート
    # subcategory_question_path = os.path.join(output_dir, 'subcategory_question.csv')
    # with open(subcategory_question_path, 'w', newline='', encoding='utf-8') as csvfile:
    #     csv_writer = csv.writer(csvfile)
    #     csv_writer.writerow(['subcategory_id', 'question_id'])
        
    #     subcategory_questions = db.query(SubcategoryQuestion).all()
    #     for sq in subcategory_questions:
    #         csv_writer.writerow([sq.subcategory_id, sq.question_id])
    
    # print(f"SubcategoryQuestion relationships exported to {subcategory_question_path}")
    
    print(f"All data exported to {output_dir}")
    
async def import_zip_file(db: Session, file: UploadFile):
    # ファイルタイプチェック（任意、拡張子やMIMEタイプ）
    if file.content_type != "application/zip":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a ZIP file.")

    # 一時ディレクトリ作成（with構文で安全に処理）
    with tempfile.TemporaryDirectory() as tmp_dir:
        zip_path = os.path.join(tmp_dir, "uploaded.zip")

        # アップロードファイルを保存
        with open(zip_path, "wb") as buffer:
            buffer.write(await file.read())

        # ZIP解凍
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(tmp_dir)

        # ファイルパス
        categories_csv_path = os.path.join(tmp_dir, "categories.csv")
        subcategories_csv_path = os.path.join(tmp_dir, "subcategories.csv")

        # ファイル存在チェック
        if not os.path.exists(categories_csv_path) or not os.path.exists(subcategories_csv_path):
            raise HTTPException(status_code=400, detail="Missing required CSV files in ZIP.")

        # DBトランザクション開始
        try:
            # インポート処理（カテゴリ → サブカテゴリ）
            import_categories_from_csv(db, categories_csv_path)
            import_subcategories_from_csv(db, subcategories_csv_path)

            # コミット
            db.commit()

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

    return {"message": "Data imported successfully"}

def import_categories_from_csv(db: Session, csv_path: str):
    with open(csv_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            category_id = row.get('id')
            name = row.get('name')
            user_id = row.get('user_id')

            if not name:
                raise HTTPException(status_code=400, detail="Category name is required in CSV.")

            # 既存カテゴリチェック
            existing_category = category_cruds.find_category_by_name(db, name)
            if existing_category:
                continue  # スキップまたは更新処理を入れてもOK

            # カテゴリ作成
            new_category = Category(
                name=name,
                user_id=user_id or 1  # デフォルト値をセット
            )
            db.add(new_category)

def import_subcategories_from_csv(db: Session, csv_path: str):
    with open(csv_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            subcategory_id = row.get('id')
            name = row.get('name')
            category_id = row.get('category_id')
            updated_at = row.get('updated_at')

            if not name or not category_id:
                raise HTTPException(status_code=400, detail="Subcategory name or category_id missing in CSV.")

            # 対応するカテゴリがDBにあるかチェック
            category = db.query(Category).filter(Category.id == category_id).first()
            if not category:
                raise HTTPException(status_code=400, detail=f"Category ID {category_id} not found for subcategory.")

            # サブカテゴリ作成
            new_subcategory = Subcategory(
                name=name,
                category_id=category_id
                # updated_atのパースが必要ならここで対応
            )
            db.add(new_subcategory)

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

                if not problem:
                    raise HTTPException(status_code=400, detail="Question problem is required.")

                # Create and add question
                question = Question(
                    problem=problem,
                    answer=answer,
                    memo=memo,
                    is_correct=is_correct,
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