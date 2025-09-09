from fastapi.testclient import TestClient

def test_find_subcategory_by_id_正常系(
    client_fixture: TestClient
):
    response = client_fixture.get("/subcategories/3")
    assert response.status_code == 200
    subcategory = response.json()
    assert isinstance(subcategory, dict)
    assert "id" in subcategory
    assert "name" in subcategory

def test_find_subcategory_by_id_異常系(
    client_fixture: TestClient
):
    response = client_fixture.get("/subcategories/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Subcategory not found"}

def test_find_subcategories_by_question_id_正常系(
    client_fixture: TestClient
):
    response = client_fixture.get("/subcategories/question_id/3")
    assert response.status_code == 200
    subcategories = response.json()
    assert isinstance(subcategories, list)
    assert len(subcategories) > 0
    for subcategory in subcategories:
        assert "id" in subcategory
        assert "name" in subcategory

    # def test_find_subcategories_by_question_id_異常系(
    #     client_fixture: TestClient
    # ):
    #     response = client_fixture.get("/subcategories/question_id/999")
    #     assert response.status_code == 404
    #     assert response.json() == {"detail": "Subcategories not found"}