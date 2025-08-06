from httpx import AsyncClient
import pytest

@pytest.mark.asyncio
def test_get_questions(client_fixture: AsyncClient):
    response = client_fixture.get("/questions")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    for question in data:
        assert "id" in question
        assert "content" in question
        assert "created_at" in question
        assert "updated_at" in question