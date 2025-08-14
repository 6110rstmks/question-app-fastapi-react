from fastapi.testclient import TestClient

def test_find_all_items(client_fixture: TestClient):
    response = client_fixture.get("/items")
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    assert len(data) > 0
    for item in data:
        assert "id" in item
        assert "name" in item
        assert "price" in item
        assert "description" in item
        assert "user_id" in item
        
def test_find_by_id_正常系(client_fixture: TestClient):
    response = client_fixture.get("/items/1")
    assert response.status_code == 200
    item = response.json()
    assert item["id"] == 1
    assert "name" in item
    assert "price" in item
    assert "description" in item
    assert "user_id" in item
    
def test_find_by_id_異常系(client_fixture: TestClient):
    response = client_fixture.get("/items/9999")  # Assuming 9999 does not exist
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}