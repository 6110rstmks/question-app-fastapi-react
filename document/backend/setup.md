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
alembic revision --autogenerate -m "alter questions column"


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

$ GRANT all privileges on alembic_version to sorasakamoto;

GRANT ALL PRIVILEGES ON TABLE questions TO sorasakamoto;
GRANT ALL PRIVILEGES ON TABLE categories TO sorasakamoto;
GRANT ALL PRIVILEGES ON TABLE subcategories TO sorasakamoto;

ALTER TABLE questions OWNER TO sorasakamoto;
ALTER TABLE categories OWNER TO sorasakamoto;
ALTER TABLE subcategories OWNER TO sorasakamoto;
ALTER TABLE category_question OWNER TO sorasakamoto;
ALTER TABLE subcategory_question OWNER TO sorasakamoto;
ALTER TABLE users OWNER TO sorasakamoto;

insert into 


$ GRANT USAGE, SELECT, UPDATE ON SEQUENCE questions_id_seq TO sorasakamoto;


============
solutionstatus(enum)の型を確認する方法

 \dT+ solutionstatus