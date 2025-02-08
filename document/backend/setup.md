```
source venv3/bin/activate
pip install -r requirements.txt
```

[step1]
uvicorn main:app --reload

[step2]
localhost:8000/docs
にアクセス

[step3]
alembic revision --autogenerate -m "Create user tables"

[step4]
alembic revision --autogenerate -m "Add foreign key"

[step5]
alembic upgrade head

================<br>
login postgresql

$ docker exec -it postgres bash

$ psql -U fastapiuser -d fleamarket

==========================
ローカルのpostgresqlをfastapiに接続するための手順（not docker）


$ \c fleamarket

テーブルに付与されている権限を確認。
$ SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users';

$ GRANT INSERT, UPDATE, DELETE, SELECT ON users TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON categories TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON subcategories TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON questions TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON category_question TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON subcategory_question TO sorasakamoto;




$ GRANT USAGE, SELECT, UPDATE ON SEQUENCE users_id_seq TO sorasakamoto;

$ GRANT USAGE, SELECT, UPDATE ON SEQUENCE categories_id_seq TO sorasakamoto;

$ GRANT USAGE, SELECT, UPDATE ON SEQUENCE subcategories_id_seq TO sorasakamoto;

$ GRANT USAGE, SELECT, UPDATE ON SEQUENCE questions_id_seq TO sorasakamoto;