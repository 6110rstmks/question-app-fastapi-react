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
    description TEXT,                      -- カテゴリ説明
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

sql
コピーする
編集する
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

<!--  -->
げんじょうのかだい→画像を使用した問題を作成できない。
data exportで画像を保存しておくことができず、s3はお金がかかるので使用したくない

githubに画像をかくのうしておいて、そのurlから引っ張ってくる？


<!--  -->

setproblempage.tsxに今日解いた問題数を表示させる。
またそのうち、
