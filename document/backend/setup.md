```
source venv3/bin/activate
pip install -r requirements.txt
```

[step1]
self-madeapp-sakamotoにて
uvicorn backend.main:app --reload

[step2]
localhost:8000/docs
にアクセス

[step3]
alembic revision --autogenerate -m "alter questions column"

[step5]
alembic upgrade head

# dockerのpostgresqlをfastapiに接続するための手順

$ docker exec -it postgres bash

$ psql -U fastapiuser -d fleamarket

# ローカルのpostgresqlをfastapiに接続するための手順（not docker）

psql -h localhost -p 5432 -U sorasakamoto -d fleamarket

（テストコード用）
psql -h localhost -p 5432 -U sorasakamoto -d for_test_code

$ \c fleamarket

テーブルに付与されている権限を確認。
$ SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users';

$ GRANT  ON SCHEMA public TO sorasakamoto;

$ GRANT USAGE, CREATE ON SCHEMA public TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON users TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON categories TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON subcategories TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON questions TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON category_question TO sorasakamoto;

$ GRANT INSERT, UPDATE, DELETE, SELECT ON subcategory_question TO sorasakamoto;

$ GRANT all privileges on alembic_version to sorasakamoto;

$ GRANT ALL PRIVILEGES ON TABLE questions TO sorasakamoto;
$ GRANT ALL PRIVILEGES ON TABLE categories TO sorasakamoto;
$ GRANT ALL PRIVILEGES ON TABLE subcategories TO sorasakamoto;

$ ALTER TABLE questions OWNER TO sorasakamoto;
$ ALTER TABLE categories OWNER TO sorasakamoto;
$ ALTER TABLE subcategories OWNER TO sorasakamoto;
$ ALTER TABLE category_question OWNER TO sorasakamoto;
$ ALTER TABLE subcategory_question OWNER TO sorasakamoto;
$ ALTER TABLE users OWNER TO sorasakamoto;

insert into 


$ GRANT USAGE, SELECT, UPDATE ON SEQUENCE questions_id_seq TO sorasakamoto;


## solutionstatus(enum)の型を確認する方法

 \dT+ solutionstatus

## SolutionStatusの型を変更するalembicのmigrationファイルの作成方法

以下のupgrade関数に置き換え。
```
def upgrade() -> None:
    # 1. 一時的に is_correct カラムを TEXT 型に変換して、Enum制約を解除
    op.execute("ALTER TABLE questions ALTER COLUMN is_correct TYPE TEXT")

    # 2. データの値を更新（古いEnum値 → 新しい値）
    op.execute("UPDATE questions SET is_correct = 'Correct' WHERE is_correct = 'PERMANENT_SOLVED'")
    op.execute("UPDATE questions SET is_correct = 'Temporary' WHERE is_correct = 'TEMPORARY_SOLVED'")
    op.execute("UPDATE questions SET is_correct = 'Incorrect' WHERE is_correct = 'NOT_SOLVED'")

    # 3. 新しい Enum 型を作成
    op.execute("CREATE TYPE solutionstatus_new AS ENUM ('Incorrect', 'Temporary', 'Correct')")

    # 4. is_correct カラムを新しいEnumに変換
    op.execute("""
        ALTER TABLE questions 
        ALTER COLUMN is_correct 
        TYPE solutionstatus_new 
        USING is_correct::solutionstatus_new
    """)

    # 5. 古いEnumを削除し、新しいEnumを元の名前に変更
    op.execute("DROP TYPE solutionstatus")
    op.execute("ALTER TYPE solutionstatus_new RENAME TO solutionstatus")
```