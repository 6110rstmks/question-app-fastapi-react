from fastapi.testclient import TestClient


def test_delete_subcategory_正常系(
    client_fixture: TestClient
):
    new_subcategory = {
        "name": "Test Subcategory",
        "category_id": 2
    }
    response = client_fixture.post("/subcategories/", json=new_subcategory)
    assert response.status_code == 201
    subcategory_id = response.json().get("id")

    response = client_fixture.delete(f"/subcategories/{subcategory_id}")
    assert response.status_code == 200

def test_delete_subcategory_異常系_idが存在しない(
    client_fixture: TestClient
):
    response = client_fixture.delete("/subcategories/9999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Subcategory not deleted"}
