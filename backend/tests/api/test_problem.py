from fastapi.testclient import TestClient

def test_generate_problem(client_fixture: TestClient):
    problem_fetch = {
        'type': 'random',
        'solved_status': 'incorrect',
        'problem_count': 10,
        'category_ids': [38, 40],
    }
    response = client_fixture.post("/problems/", json=problem_fetch)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    
def test_generate_problem_異常系_typeが不正(client_fixture: TestClient):
    problem_fetch = {
        'type': 'unknown_type',
        'solved_status': 'incorrect',
        'problem_count': 10,
        'category_ids': [38, 40],
    }
    response = client_fixture.post("/problems/", json=problem_fetch)
    print(response.json())
    assert response.status_code == 418
    data = response.json()
    assert data["message"] == "unknown_typeという不明なタイプが入力されました。"