## 概要

削除したはずが、削除できておらず、溜まっているcategory_question, subcategory_questionはないか確認する。



また、question_idが存在するはずなのにCategoryQuestionやSubcategoryQuestionがないものを検索して
洗い出す
そして、そのcategory_idとquestion_id


## ジョブの実行方法


backend>jobs>insert_nonexistent_category_question_record.py
backend>jobs>check_nonexistent_category_question_record.py


