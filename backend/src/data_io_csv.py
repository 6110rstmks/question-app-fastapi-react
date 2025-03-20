import csv
import os
from sqlalchemy.orm import Session
import json
import zipfile
import tempfile
from fastapi import UploadFile, HTTPException
from models2 import Category, Subcategory, Question, CategoryQuestion, SubcategoryQuestion
from cruds import category_crud as category_cruds



def export_data_to_csv(db: Session, output_dir: str):
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
    
    # 3. 質問をエクスポート
    questions_path = os.path.join(output_dir, 'questions.csv')
    with open(questions_path, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['id', 'problem', 'answer', 'memo', 'is_correct', 
                            'answer_count', 'last_answered_date'])
        
        questions = db.query(Question).all()
        for question in questions:
            # ARRAY型のanswerをCSV用に文字列に変換
            # answer_str = ';'.join(question.answer) if question.answer else ''

            # answer を JSON 文字列に変換（リストの場合）
            answer_str = json.dumps(question.answer, ensure_ascii=False) if question.answer else '[]'

            print(answer_str)
            print('-----------------')
            
            csv_writer.writerow([
                question.id,
                question.problem,
                answer_str,
                question.memo or '',
                question.is_correct,
                question.answer_count,
                question.last_answered_date.isoformat() if question.last_answered_date else ''
            ])
    
    print(f"Questions exported to {questions_path}")
    
    # 4. カテゴリ・質問の関連をエクスポート
    category_question_path = os.path.join(output_dir, 'categories_questions.csv')
    with open(category_question_path, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['category_id', 'question_id'])
        
        category_questions = db.query(CategoryQuestion).all()
        for cq in category_questions:
            csv_writer.writerow([cq.category_id, cq.question_id])
    
    print(f"CategoryQuestion relationships exported to {category_question_path}")
    
    # 5. サブカテゴリ・質問の関連をエクスポート
    subcategory_question_path = os.path.join(output_dir, 'subcategories_questions.csv')
    with open(subcategory_question_path, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['subcategory_id', 'question_id'])
        
        subcategory_questions = db.query(SubcategoryQuestion).all()
        for sq in subcategory_questions:
            csv_writer.writerow([sq.subcategory_id, sq.question_id])
    
    print(f"SubcategoryQuestion relationships exported to {subcategory_question_path}")
    
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
        questions_csv_path = os.path.join(tmp_dir, "questions.csv")

        # ファイル存在チェック
        if not os.path.exists(categories_csv_path) or not os.path.exists(subcategories_csv_path):
            raise HTTPException(status_code=400, detail="Missing required CSV files in ZIP.")

        # DBトランザクション開始
        try:
            # インポート処理（カテゴリ → サブカテゴリ）
            import_categories_from_csv(db, categories_csv_path)
            import_subcategories_from_csv(db, subcategories_csv_path)
            import_questions_from_csv(db, questions_csv_path)
            # import_category_questions_from_csv(db, categories_questions_csv_path)
            # import_subcategory_questions_from_csv(db, subcategories_questions_csv_path)

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

def import_questions_from_csv(db: Session, csv_path: str):
    with open(csv_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            question_id = row.get('id')
            problem = row.get('problem')
            answer = row.get('answer')
            memo = row.get('memo')
            is_correct = row.get('is_correct')
            answer_count = row.get('answer_count')
            last_answered_date = row.get('last_answered_date')

            if not problem:
                raise HTTPException(status_code=400, detail="Question problem is required in CSV.")

            # answerのパース（リスト型に変換）
            answer = json.loads(answer) if answer else []

            # 質問作成
            new_question = Question(
                problem=problem,
                answer=answer,
                memo=memo,
                is_correct=is_correct,
                answer_count=answer_count,
                last_answered_date=last_answered_date
            )
            db.add(new_question)