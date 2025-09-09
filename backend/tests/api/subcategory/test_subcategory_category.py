from fastapi.testclient import TestClient


def test_create_subcategory_正常系(client_fixture: TestClient):
    new_subcategory = {
        "name": "Test Subcategory",
        "category_id": 2
    }
    response = client_fixture.post("/subcategories/", json=new_subcategory)
    assert response.status_code == 201
    assert "id" in response.json()
    
    # 冪等性のため、サブカテゴリを削除
    subcategory_id = response.json().get("id")
    response = client_fixture.delete(f"/subcategories/{subcategory_id}")
    assert response.status_code == 200
    
def test_create_subcategory_異常系_category_idが存在しない(client_fixture: TestClient):
    new_subcategory = {
        "name": "Test Subcategory",
        "category_id": 9999
    }
    response = client_fixture.post("/subcategories/", json=new_subcategory)
    assert response.status_code == 404
    assert response.json() == {"detail": "Category not found"}