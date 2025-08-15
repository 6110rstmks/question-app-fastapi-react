from fastapi.testclient import TestClient

from unittest.mock import MagicMock

from backend.cruds import question_crud

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
    
    client_fixture.delete(f"/questions/{question['id']}")
    
def test_update_question(client_fixture: TestClient):
    # update_data = {
    #     "problem": "Updated problem",
    #     "answer": ["Updated answer"],
    #     "memo": "Updated memo"
    # }
    # response = client_fixture.put("/questions/1", json=update_data)
    # assert response.status_code == 200
    # question = response.json()
    # assert question["problem"] == update_data["problem"]
    # assert question["answer"] == update_data["answer"]
    # assert question["memo"] == update_data["memo"]
    pass

def test_delete_question(client_fixture: TestClient):
    # response = client_fixture.delete("/questions/1")
    # assert response.status_code == 200
    # deleted_question = response.json()
    # assert deleted_question["id"] == 1
    
    # # Check if the question is actually deleted
    # response = client_fixture.get("/questions/1")
    # assert response.status_code == 404
    # assert response.json() == {"detail": "Question not found"}
    pass
