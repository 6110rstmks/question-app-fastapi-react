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