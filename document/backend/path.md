## Pathのルールについて統一する。

相対パスではなくて、絶対パスでインポートを行う。

常に backend のルートで実行する

# バックエンド起動
uvicorn main:app --reload

# テスト実行
pytest backend/tests