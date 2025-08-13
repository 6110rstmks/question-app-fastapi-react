## Pathのルールについて統一する。

相対パスではなくて、絶対パスでインポートを行う。

常に self-madeapp-sakamoto のルートで実行する

# バックエンド起動
uvicorn backend.main:app --reload

# テスト実行
pytest backend/tests