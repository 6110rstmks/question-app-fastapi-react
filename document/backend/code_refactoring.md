## 単一原則の責任


## crudファイル内の命名規則統一

具体的に書く
ex.
find_all ❌
find_all_questions ⭕️

find_by_id ❌
find_question_by_question_id ⭕️

create ❌
create_question ⭕️

## フロントエンドAPIを呼び出す関数の命名規則統一

Read -> fetch
Create -> create
Delete -> delete
Update -> update
Increment -> increment


- カラムでひっかけてプロパティを取得
→By 

ex) name
-> ByName

- 取得したモデルにプラスなにかのデータキーが付属している
ex) QuestionWithCategoryId






## 変数名命名規則
Model A + Model B
Model Aの複数形 + Model Bの複数形

ex.
subcategoryquestion
subcategoriesquestions


