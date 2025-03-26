# 将来実装予定の案

当日・今週・今月に解いた問題をグラフとして表示させる。
matplotlib？

回答ログはanswer_logs_today, answer_logs_this_week, answer_logs_this_monthテーブルに格納。

この1週間で解いた問題のカテゴリの種類みたいな棒グラフを作成
この半月で解いた問題のカテゴリの種類みたいな棒グラフを作成

↓

これによってなにがしたいかというと、

横軸がカテゴリ名、　縦軸が解いた問題数？


翌日の12:00に全件削除するcronを走らせる。

→実装優先度低い

===============
alertの部分を
https://zenn.dev/chot/articles/react-router7-flash-message
フラッシュメッセージを実装したいreact

===========
問題詳細ページ(problemPage.tsx)からProblemを解くことができるようにする。

そして回答したら、それをanswer_logsテーブルに格納。

problemPage.tsxの問題出題画面と異なることは、問題出題画面にわざわざ飛ばなくても、QuestionPage.tsxから問題に回答してログを残せるということ。

画面設計をまず考える必要がある。

===========<br>
githubのあるブランチ(save/log)を回答ログのデータベースとして使用する。

回答が完了したら、ブランチ(save/log)を切ってそれに対してanwswer_log/answer_log.jsonのコミットプッシュを行う。

データの集計を行う際（データ集計を行うのボタンをクリック）は
ブランチ(save/log)のanswer_logディレクトリをpullして、すべてのcsvファイルを一旦dbにinsertするなどして、集計を行う。
dbに入れる必要はないかもしれない。

=============<br>


==============

categoryboxで表示するcategoryの順番を変更できるようにする、
ピン留めボタンを押すことで、そのcategoryboxを先頭に移動させる。
実装方法としてテーブルのカラム構成を考える。


CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,      -- カテゴリID
    name VARCHAR(255) NOT NULL,            -- カテゴリ名
    pinned_order INT DEFAULT NULL,         -- ピン留めカテゴリの順序（NULLの場合は通常カテゴリ）
    <!-- display_order INT DEFAULT NULL         -- 通常カテゴリの表示順序（NULLはピン留めカテゴリが先） -->
);

カラムの詳細
pinned_order:

ピン留めカテゴリの表示順序を管理するカラム。
値が小さいほど上位に表示される。
ピン留めされていないカテゴリはNULLとなる。

display_order:

通常カテゴリの表示順序を管理するカラム。
ピン留めカテゴリはこのカラムの値に関係なく、pinned_orderの順序に従って表示される。
表示の順序
カテゴリの一覧を取得する際、以下の順序でソートします。


SELECT *
FROM category
ORDER BY 
    CASE WHEN pinned_order IS NOT NULL THEN 0 ELSE 1 END,  -- ピン留めカテゴリを先頭に
    pinned_order ASC,                                     -- ピン留めカテゴリの順序
    display_order ASC;                                    -- 通常カテゴリの順序
実装フロー
1. ピン留めする
ピン留めボタンを押した際、該当カテゴリのpinned_orderを設定します。
ピン留め順序は現在の最大値+1を設定することで調整可能です。

sql
コピーする
編集する
UPDATE category
SET pinned_order = (
    SELECT COALESCE(MAX(pinned_order), 0) + 1 FROM category
)
WHERE id = ?;
2. ピン留め解除する
ピン留めを解除したいカテゴリのpinned_orderをNULLに設定します。
必要であれば、display_orderに値を設定して通常カテゴリとして扱います。

sql
コピーする
編集する
UPDATE category
SET pinned_order = NULL,
    display_order = (
        SELECT COALESCE(MAX(display_order), 0) + 1 FROM category WHERE pinned_order IS NULL
    )
WHERE id = ?;

ピン留めのカテゴリ情報は
dataのexportに含める必要はないな。
どうしてかというと、ピン留めしたいのは一時的なものであるから。

<!--  -->
げんじょうのかだい→画像を使用した問題を作成できない。
data exportで画像を保存しておくことができず、s3はお金がかかるので使用したくない

githubに画像をかくのうしておいて、そのurlから引っ張ってくる？

インターネットのurlをはってそのurlから画像データをfetchする


<!--  -->
サブカてごりのしたにさらにもうひとつカテゴリが欲しい。
名前は　tag
でsubcategory_tagみたいなテーブルを作る。

->今の所必要な場面はない。

<!--  -->
problemnormal.page.tsxからquestion editをできるようにする。

<!--  -->
問題タイプをつける。
穴ぬけ問題→  word　type
自分で文章で答える→sentence type
->無闇にデータ量増やすだけな気がするので没案。

<!--  -->
questionid 440,441のcategoryid復旧

同カテゴリ内においてサブカテゴリを変更した際に
カテゴリid の紐付けがとけてしまう問題が発生している。


<!--  -->
削除したはずが、削除できておらず、溜まっているcategory_question, subcategory_questionはないか確認する。


<!--  -->
また、question_idが存在するはずなのにcategory_idやsubcategory_idがないものを検索して
洗い出すジョブを作る。

backend>jobs>insert_nonexistent_category_question_record.py
backend>jobs>check_nonexistent_category_question_record.py
