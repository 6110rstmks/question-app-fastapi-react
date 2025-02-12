from models2 import SubcategoryQuestion

def find_subcategory_question_by_question_id(db, question_id: int):
    return db.query(SubcategoryQuestion).where(SubcategoryQuestion.question_id == question_id).first()    