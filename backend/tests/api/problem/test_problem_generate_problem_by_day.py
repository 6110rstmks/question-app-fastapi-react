from fastapi.testclient import TestClient
from backend.cruds.category_crud import find_all_categories
# from backend.cruds.subcategory_crud import find_
from backend.cruds.category_question_crud import find_categoriesquestions_by_question_id
from backend.cruds.subcategory_question_crud import find_subcategoriesquestions_by_question_id
from backend.cruds.category_blacklist_crud import find_all_category_blacklist
from typing import Annotated
from sqlalchemy.orm import Session
from backend.database import get_db
from fastapi import Depends
import random

def test_generate_problem_by_day_正常系(
    client_fixture: TestClient,
):
    response = client_fixture.get("/problems/day/2025-08-30")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_generate_problem_by_day_異常系(
    client_fixture: TestClient,
):
    response = client_fixture.get("/problems/day/2000-08-30")
    assert response.status_code == 404
    data = response.json()
    assert data['detail'] == "出題する問題がありませんでした。"