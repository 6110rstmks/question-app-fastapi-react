エクスポートで出力されるフォルダに入っているファイルは以下の構成。計6つのファイル 

 
Category 一覧（csv) 

Subcategory一覧(csv) 

Question一覧

category-subcategory 一覧 
Subcategory-quetionテーブルの一覧 
category-question

マスタデータ（カテゴリ数、subcategory数、question数）→これいらないか。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝ 

もしくはエクスポート処理、インポート処理をカテゴリ単位で行う。 

カテゴリ一覧ファイルも一緒に渡すことで、例えばmathファイルをインポートするのを忘れていたときに、フロントエンドにmathファイルが読み込まれていません。とアラートを出す機能を作成することができる。 

Ex) economics 


さらにそのsubcateogry_idを取得して　そこからquetionを作成する 
