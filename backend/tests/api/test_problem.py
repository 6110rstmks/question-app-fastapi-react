from fastapi.testclient import TestClient
from backend.cruds.category_crud import find_all_categories
from backend.cruds.category_question_crud import find_categoriesquestions_by_question_id
from backend.cruds.subcategory_question_crud import find_subcategoriesquestions_by_question_id
from backend.cruds.category_blacklist_crud import find_all_category_blacklist
from typing import Annotated
from sqlalchemy.orm import Session
from backend.database import get_db
from fastapi import Depends
import random



DbDependency = Annotated[Session, Depends(get_db)]

def to_dict(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

def test_generate_problem_正常系_typeがrandom(
    client_fixture: TestClient,
    session_fixture
):
    problem_fetch = {
        'type': 'random',
        'solved_status': 'incorrect',
        'problem_count': 5,
    }
    response = client_fixture.post("/problems/", json=problem_fetch)
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) > 0
    
    problem_category_ids = []
    for datum in data:
        category_questions = find_categoriesquestions_by_question_id(session_fixture, datum['id'])
        for category_question in category_questions:
            problem_category_ids.append(category_question.category_id)
    
    assert len(set(problem_category_ids)) != 1
    
def test_generate_problem_正常系_typeがcategory(
    client_fixture: TestClient,
    session_fixture
):

    category_blacklist = find_all_category_blacklist(session_fixture)
    category_blacklist_ids = [cb.category_id for cb in category_blacklist]
    category_ids = [c.id for c in find_all_categories(session_fixture) if c.id not in category_blacklist_ids]
    available_categories = set(category_ids) - set(category_blacklist_ids)
    two_picked_category_ids = random.sample(available_categories, 10)
    print(two_picked_category_ids)

    problem_fetch = {
        'type': 'category',
        'solved_status': 'incorrect',
        'problem_count': 5,
        'category_ids': list(two_picked_category_ids),
    }
    response = client_fixture.post("/problems/", json=problem_fetch)
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) > 0
    
    problem_category_ids = []
    for datum in data:
        category_questions = find_categoriesquestions_by_question_id(session_fixture, datum['id'])
        for category_question in category_questions:
            problem_category_ids.append(category_question.category_id)

    assert set(problem_category_ids).issubset(two_picked_category_ids)

def test_generate_problem_正常系_typeがsubcategory(
    client_fixture: TestClient,
    session_fixture
):
    
    # problem_fetch = {
    #     'type': 'subcategory',
    #     'solved_status': 'incorrect',
    #     'problem_count': 5,
    #     'subcategory_ids': [11, 12],
    # }
    # response = client_fixture.post("/problems/", json=problem_fetch)
    # print(response.json())
    # data = response.json()
    # assert response.status_code == 200
    
    

    # assert len(data) > 0

    # problem_subcategory_ids = []
    # for datum in data:
    #     subcategory_questions = find_subcategoriesquestions_by_question_id(session_fixture, datum['id'])
    #     for subcategory_question in subcategory_questions:
    #         problem_subcategory_ids.append(subcategory_question.subcategory_id)

    # assert set(problem_subcategory_ids).issubset({1, 2})
    pass

def test_generate_problem_異常系_problem_countが0(
    client_fixture: TestClient
):
    problem_fetch = {
        'type': 'category',
        'solved_status': 'incorrect',
        'problem_count': 0,
        'category_ids': [38, 40],
    }
    response = client_fixture.post("/problems/", json=problem_fetch)
    assert response.status_code == 422
    
def test_generate_problem_異常系_typeが不正(client_fixture: TestClient):
    problem_fetch = {
        'type': 'unknown_type',
        'solved_status': 'incorrect',
        'problem_count': 10,
        'category_ids': [38, 40],
    }
    response = client_fixture.post("/problems/", json=problem_fetch)
    print(response.json())
    assert response.status_code == 400
    data = response.json()
    assert data['detail'] == "不明なタイプが入力されました。"
    
def test_generate_problem_異常系_typeがcategoryでcategory_idsが存在しない(client_fixture: TestClient):
    problem_fetch = {
        'type': 'category',
        'solved_status': 'incorrect',
        'problem_count': 10,
        'category_ids': [999, 9999],
    }
    response = client_fixture.post("/problems/", json=problem_fetch)
    assert response.status_code == 400
    data = response.json()
    assert data['detail'] == "出題する問題がありませんでした。"

def test_generate_problem_異常系_typeがsubcategoryでsubcategory_idsが存在しない(client_fixture: TestClient):
    problem_fetch = {
        'type': 'subcategory',
        'solved_status': 'incorrect',
        'problem_count': 10,
        'subcategory_ids': [999, 9999],
    }
    response = client_fixture.post("/problems/", json=problem_fetch)
    assert response.status_code == 400
    data = response.json()
    assert data['detail'] == "出題する問題がありませんでした。"
