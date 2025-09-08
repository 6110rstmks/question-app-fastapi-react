from fastapi.testclient import TestClient

def test_increment_answer_count(client_fixture: TestClient):
    new_question = {
        "problem": "What is the capital of France?",
        "answer": ["Paris"],
        "memo": "Capital city of France",
        "category_id": 2,
        "subcategory_id": 95
    }
    response = client_fixture.post("/questions", json=new_question)
    question_id = (response.json())['id']
    
    response = client_fixture.put(f"/questions/increment_answer_count/{question_id}")
    assert response.status_code == 200
    question = response.json()
    assert question["answer_count"] == 1  
    
    response = client_fixture.put(f"/questions/increment_answer_count/{question_id}")
    assert response.status_code == 200
    question = response.json()
    assert question["answer_count"] == 2  
    
    # 冪等性のために作成したデータを削除する
    client_fixture.delete(f"/questions/{question_id}")
    
def test_increment_answer_count_異常系_存在しないid(client_fixture: TestClient):
    response = client_fixture.put("/questions/increment_answer_count/9999") 
    assert response.status_code == 404  
    assert response.json() == {"detail": "Question not updated"}
    






