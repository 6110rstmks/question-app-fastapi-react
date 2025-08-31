from fastapi.testclient import TestClient


def test_create_question_正常系(client_fixture: TestClient):
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
    
def test_create_question_異常系_存在しないcategory_id(client_fixture: TestClient):
    invalid_question = {
        "problem": "What is the capital of France?",
        "answer": ["Paris"],
        "memo": "Capital city of France",
        "category_id": 9999,  
        "subcategory_id": 95
    }
    response = client_fixture.post("/questions", json=invalid_question)
    assert response.status_code == 404  
    assert response.json() == {"detail": "Category not found"}
    
def test_create_question_異常系_存在しないsubcategory_id(client_fixture: TestClient):
    invalid_question = {
        "problem": "What is the capital of France?",
        "answer": ["Paris"],
        "memo": "Capital city of France",
        "category_id": 2,
        "subcategory_id": 9999  
    }
    response = client_fixture.post("/questions", json=invalid_question)
    assert response.status_code == 404  
    assert response.json() == {"detail": "Subcategory not found"}
    


    
