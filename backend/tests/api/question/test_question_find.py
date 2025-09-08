"""
backendディレクトリの一つ上のディレクトリで実行する。
pytest -s backend/tests/api/test_question.py
"""

from fastapi.testclient import TestClient

def test_find_all_questions_正常系(client_fixture: TestClient):
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
    
def test_find_question_by_id_異常系_idが存在しない(client_fixture: TestClient):
    response = client_fixture.get("/questions/9999") 
    assert response.status_code == 404
    assert response.json() == {"detail": "Question not found"}
    
def test_find_all_questions_in_category(client_fixture: TestClient):
    response = client_fixture.get("/questions/category_id/2")
    assert response.status_code == 200
    questions = response.json()
    assert isinstance(questions, list)
    assert len(questions) > 0
    for question in questions:
        assert "id" in question
        assert "problem" in question
        
def test_find_all_questions_異常系_category_idが存在しない(client_fixture: TestClient):
    response = client_fixture.get("/questions/category_id/9999") 
    assert response.status_code == 404
    assert response.json() == {"detail": "Category not found"}
    
def test_find_all_questions_in_subcategory(client_fixture: TestClient):
    response = client_fixture.get("/questions/subcategory_id/95")
    assert response.status_code == 200
    questions = response.json()
    assert isinstance(questions, list)
    assert len(questions) > 0
    for question in questions:
        assert "id" in question
        assert "problem" in question
        
def test_find_all_questions_異常系_subcategory_idが存在しない(client_fixture: TestClient):
    response = client_fixture.get("/questions/subcategory_id/9999") 
    assert response.status_code == 200
    questions = response.json()
    assert isinstance(questions, list)
    assert len(questions) == 0