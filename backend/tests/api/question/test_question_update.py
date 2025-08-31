from fastapi.testclient import TestClient

def test_update_question(client_fixture: TestClient):
    
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
    
    update_data = {
        "problem": "列志向データベースの強みを説明せよ",
        "answer": ["Answer1", "Answer2"],
        "memo": "ここにquestionに関するメモを記入できます",
        "is_correct": 1
    }
    response = client_fixture.put(f"/questions/{question_id}", json=update_data)
    assert response.status_code == 200
    question = response.json()
    assert question["problem"] == update_data["problem"]
    assert question["answer"] == update_data["answer"]
    assert question["memo"] == update_data["memo"]
    
    # 冪等性のために作成したデータを削除する
    client_fixture.delete(f"/questions/{question_id}")
    
def test_update_question_異常系_存在しないid(client_fixture: TestClient):
    update_data = {
        "problem": "列志向データベースの強みを説明せよ",
        "answer": ["Answer1", "Answer2"],
        "memo": "ここにquestionに関するメモを記入できます",
        "is_correct": 1
    }
    response = client_fixture.put("/questions/9999", json=update_data) 
    assert response.status_code == 404  
    assert response.json() == {"detail": "Question not updated"}
    
def test_update_is_correct(client_fixture: TestClient):
    new_question = {
        "problem": "What is the capital of France?",
        "answer": ["Paris"],
        "memo": "Capital city of France",
        "category_id": 2,
        "subcategory_id": 95
    }
    response = client_fixture.post("/questions", json=new_question)
    question_id = (response.json())['id']
    
    update_data = {
        "is_correct": 1  
    }
    response = client_fixture.put(f"/questions/edit_flg/{question_id}", json=update_data)
    assert response.status_code == 200
    question = response.json()
    assert question["is_correct"] == update_data["is_correct"]
    
    # 冪等性のために作成したデータを削除する
    client_fixture.delete(f"/questions/{question_id}")
    
def test_update_is_correct_異常系_存在しないid(client_fixture: TestClient):
    update_data = {
        "is_correct": 1  
    }
    response = client_fixture.put("/questions/edit_flg/9999", json=update_data) 
    assert response.status_code == 404  
    assert response.json() == {"detail": "Question not updated"}

