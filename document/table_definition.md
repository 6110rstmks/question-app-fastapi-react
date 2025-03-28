## Category テーブル定義書

| 列名          | データ型      | NULL許容 | デフォルト値     | 説明/制約                                      |
|---------------|--------------|----------|-----------------|------------------------------------------------|
| id            | Integer       | No       |                 | 主キー                                          |
| name          | String        | No       |                 | カテゴリ名                                      |
| created_at    | DateTime      | No       | datetime.now()  | 作成日時                                        |
| updated_at    | DateTime      | No       | datetime.now()  | 更新日時（onupdateで更新時に現在時刻に変更）    |
| user_id       | Integer       | No       |                 | ユーザーID（`users.id`への外部キー、削除時にCASCADE） |

## Subcategory テーブル定義書

| 列名          | データ型      | NULL許容 | デフォルト値 | 説明/制約                                      |
|---------------|--------------|----------|-------------|------------------------------------------------|
| id            | Integer       | No       |             | 主キー                                          |




## SubcategoryQuestion Table

| Column Name     | Data Type | Constraints                  | Description |
|-----------------|-----------|------------------------------|-------------|
| subcategory_id  | Integer   | Primary Key, Foreign Key     | Identifies the subcategory associated with a question. References `subcategories.id`. |
| question_id     | Integer   | Primary Key, Foreign Key     | Identifies the question associated with a subcategory. References `questions.id`. |