from fastapi.testclient import TestClient
from datetime import date, datetime, timedelta

def test_get_today_problems_正常系(
    client_fixture: TestClient,
):
    today = date.today()
    tomorrow = today + timedelta(days=1)

    response = client_fixture.get("/problems/today")
    assert response.status_code == 200
    questions = response.json()

    question_dates = [
        datetime.fromisoformat(q['last_answered_date']).date()
        for q in questions
    ]
    
    assert any(d in question_dates for d in (today, tomorrow))
