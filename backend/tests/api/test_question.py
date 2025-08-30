"""
backendディレクトリの一つ上のディレクトリで実行する。
pytest -s backend/tests/api/test_question.py
"""

from fastapi.testclient import TestClient

from unittest.mock import MagicMock

# エンドポイントの疎通確認と最低限のレスポンス構造検証にとどまっている
def test_find_all_questions(client_fixture: TestClient):
    response = client_fixture.get("/questions")
    assert response.status_code == 200
    questions = response.json()
    assert isinstance(questions, list)
    assert len(questions) > 0
    for question in questions:
        assert "id" in question
        assert "problem" in question
        
def test_find_question_by_id_正常系(client_fixture: TestClient):
    response = client_fixture.get("/questions/1")
    assert response.status_code == 200
    question = response.json()
    assert question["id"] == 1
    assert "problem" in question
    
def test_find_question_by_id_異常系(client_fixture: TestClient):
    response = client_fixture.get("/questions/9999") 
    assert response.status_code == 404
    assert response.json() == {"detail": "Question not found"}
    
def test_create_question(client_fixture: TestClient):
    new_question = {
        "problem": "What is the capital of France?",
        "answer": ["Paris"],
        "memo": "Capital city of France",
        "category_id": 2,
        "subcategory_id": 95
    }
    response = client_fixture.post("/questions", json=new_question)
    assert response.status_code == 201
    question = response.json()
    assert question["problem"] == new_question["problem"]
    assert question["answer"] == new_question["answer"]
    assert question["memo"] == new_question["memo"]
    
    # 冪等性のために作成したデータを削除する
    client_fixture.delete(f"/questions/{question['id']}")
    
def test_create_question_異常系_problemが短すぎる(client_fixture: TestClient):
    invalid_question = {
        "problem": "A", 
        "answer": ["Answer"],
        "memo": "Memo",
        "category_id": 2,
        "subcategory_id": 95
    }
    response = client_fixture.post("/questions", json=invalid_question)
    assert response.status_code == 422 
    assert {} == response.json()
    
# def test_update_question(client_fixture: TestClient):
    
#     new_question = {
#         "problem": "What is the capital of France?",
#         "answer": ["Paris"],
#         "memo": "Capital city of France",
#         "category_id": 2,
#         "subcategory_id": 95
#     }
#     response = client_fixture.post("/questions", json=new_question)
    
#     print((response.json())['id'])
    
#     question_id = (response.json())['id']
#     print(f"Created question ID: {question_id}")
    
#     update_data = {
#         "problem": "列志向データベースの強みを説明せよ",
#         "answer": ["Answer1", "Answer2"],
#         "memo": "ここにquestionに関するメモを記入できます",
#         "is_correct": 1
#     }
#     response = client_fixture.put("/questions/{question_id}", json=update_data)
#     assert response.status_code == 200
#     question = response.json()
#     assert question["problem"] == update_data["problem"]
#     assert question["answer"] == update_data["answer"]
#     assert question["memo"] == update_data["memo"]
    
#     # 冪等性のために作成したデータを削除する
#     client_fixture.delete(f"/questions/{question_id}")
    
    pass

def test_delete_question(client_fixture: TestClient):
    new_question = {
        "problem": "What is the capital of France?",
        "answer": ["Paris"],
        "memo": "Capital city of France",
        "category_id": 2,
        "subcategory_id": 95
    }
    response = client_fixture.post("/questions", json=new_question)
    
    print((response.json())['id'])
    
    question_id = (response.json())['id']
    print(f"Created question ID: {question_id}")
    
    response = client_fixture.delete(f"/questions/{question_id}")
    assert response.status_code == 200
    deleted_question = response.json()
    assert deleted_question["id"] == question_id
    
    # 本当に削除されたか確認する
    response = client_fixture.get(f"/questions/{question_id}")
    assert response.status_code == 404

    pass
