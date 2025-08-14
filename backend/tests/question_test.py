from httpx import AsyncClient
import pytest
from unittest.mock import MagicMock
from backend.cruds import question_crud
from backend.models import Question

# @pytest.mark.asyncio
# def test_get_questions(client_fixture: AsyncClient):
#     response = client_fixture.get("/questions")
#     assert response.status_code == 200
#     data = response.json()
#     assert isinstance(data, list)
#     assert len(data) > 0
#     for question in data:
#         assert "id" in question
#         assert "content" in question
#         assert "created_at" in question
#         assert "updated_at" in question

@pytest.fixture
def mock_db():
    return MagicMock()

def test_find_all_questions_all(mock_db):
    # 準備
    expected_questions = [Question(problem="Q1"), Question(problem="Q2")]
    print("Expected Questions:", expected_questions)
    mock_db.query.return_value.all.return_value = expected_questions

    # 実行
    result = question_crud.find_all_questions(mock_db)

    # 検証
    assert result == expected_questions
    mock_db.query.assert_called_once_with(Question)