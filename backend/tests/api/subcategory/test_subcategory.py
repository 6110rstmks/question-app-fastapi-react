from fastapi.testclient import TestClient

def test_find_subcategory_in_categorybox(
    client_fixture: TestClient
):
    response = client_fixture.get("/subcategories")
    assert response.status_code == 200
    subcategories = response.json()
    assert isinstance(subcategories, list)
    assert len(subcategories) > 0
    for subcategory in subcategories:
        assert "id" in subcategory
        assert "name" in subcategory
