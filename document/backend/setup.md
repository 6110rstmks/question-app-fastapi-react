```
source venv3/bin/activate
pip install -r requirements.txt
```

[step1]
uvicorn main:app --reload
j
[step2]
localhost:8000/docs
にアクセス

[step3]
alembic revision --autogenerate -m "Create user tables"

[step4]
alembic revision --autogenerate -m "Add foreign key"

[step5]
alembic upgrade head