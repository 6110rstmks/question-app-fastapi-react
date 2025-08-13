## Pathのルールについて統一する。

常に /self-madeapp-sakamoto のルートで実行する

コマンド例：

bash
コピーする
編集する
# アプリ起動
uvicorn backend.main:app --reload

# テスト実行
pytest backend/tests