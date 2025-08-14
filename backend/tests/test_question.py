from fastapi.testclient import TestClient

def test_find_all(client_fixture: TestClient):
    response = client_fixture.get("/questions")
    assert response.status_code == 200
    questions = response.json()
    assert isinstance(questions, list)
    assert len(questions) > 0
    for question in questions:
        assert "id" in question
        assert "problem" in question