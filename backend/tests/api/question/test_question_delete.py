from fastapi.testclient import TestClient

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

def test_delete_question_異常系_存在しないid(client_fixture: TestClient):
    response = client_fixture.delete("/questions/9999") 
    assert response.status_code == 404  
    assert response.json() == {"detail": "Question not deleted"}