### 将来実装予定の案

tailwindでdarkscale対応

問題出題画面でeditをして編集し終わった後にページのリロードをするとエラーが発生する。
1. 原因とくてい
2. コード修正

コードブロックを使用できるようにする。

s3に接続するためのaws libraryをラッパーしたファイルを作成。
画像を入れる。
backend/utils/s3.py


せっかくデータがあるのでRAGとか導入したいな。

frontendテストコードを網羅する。
patchを使用してbackendコードをする。

問題が例えば4だい、出題されてときおわって、
再度問題を解きなおすボタンを押した時に、correct,inccorectの変更などが反映されるようにする。

削除したその日は論理削除にする。
翌日に問題を解いた際に、論理削除のものを物理削除する。
ホーム画面から昨日以前がdelete_atのものをすべて削除できるボタンを作る。

subcategorypageのquestion一覧おいて、本日解いた問題には星をつける。


関連するワードを含むquestionを表示す機能を作成。
ボタンを押すと検索して表示させる。

サブカテゴリ内のtemporaryの問題をすべてまとめてincorrectに変える。
例えば、長い期間そのジャンルに触れておらず、すべてあたまから抜けている場合などに利用する。
ex) geography > locationなど

バックエンドの単体テストコードを書く。(関数単位のテストもしくはapiテスト)

それをgithub actionsでbackend-ciを走らせる。（無料）

問題生成画面の右側にて、question検索ができてそれを表示させれるようにしたい。

github actionsにはdependabotを入れる

今日といた問題を復習を押して、表示させたときは、
この問題は本日は表示しない。
とさせる。
その後、日付が翌日になったら、

questionpage一覧において、incorrect, correct,temporaryの状態を変化させると回答した回数がインクリメントされるが、

https://ankimaker.com/dash/workbooks/4b02ab7e-ad60-4d24-bd55-e47c8a8274db
暗記メーカーのこのUIを参考にする。

dropboxに対して画像を投稿するapiがあり、それをpythonから実行する。
https://chatgpt.com/c/6890e510-ff8c-800d-9b96-7bdeaba5c120



サブカテゴリ内で文字列を検索することで
その文字列を含む解答、問題を持ったquwstionに絞り込む。





カテゴリ内でQuestionを問題文、解答で検索して表示する。
→画面の右半分側に表示する。




Correct, Temporary, Incorrectの定義をしっかり定める。
ここにさらに　OnHoldのようなタイプも追加したい。→今はよくわからないのでこの問題は解かない。

(10)onHold →問題に対する理解がないので、一旦保留にする。

(0)incorrect →とけていない。短期記憶にも入っていない。￥

(1)temp correct→二週間立てば忘れてる。

(2)correct→ 2ヶ月立てば忘れてる。

perfect correct→半年たってもわすれてないであろう知識


familiar(incorrect)
recognition
recall
automatic

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
カテゴリにこれは出題しないのフラグをつける。
例えば、基本情報のテスト一週間前の勉強期間だとして、それが以外の問題が
ランダム選択時に出てきて欲しくない。またはカレンダーのincorrectの表示にでてきてほしっくないとか。

ブラックリスト方式と
ホワイトリスト方式を設ける。

→ただこれはexportには出力しない。

ーーーーーーー

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

http://localhost:3000/question_list
をgetメソッドにして
urlに表示されるようにしたい

理由は　ブラウザのページを一つ戻るをしたときに
検索結果が表示されてほしいから。

===========

cssの色を共通のところからとってくる。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

Questionpaeのsolution_statusの選択をプルダウンにする。
https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_select

＝＝＝＝＝＝＝＝＝＝＝

サブカテゴリの他カテゴリへの取り付け

現状
other > IPL・レーザーに入っているサブカテゴリを
skin > IPL・レーザーに変更したい。

＝＝＝＝＝＝＝＝
SolutionStatus　に保留」を追加したい。

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

->例えば　geography > soilで
間帯土壌と風帯土壌で区分したい

IPL・レーザーでIPL・レーザーで区分してサブカテゴリ内で問題を出題したいケースがでてくる。


<!--  -->
問題タイプをつける。
穴ぬけ問題→  word　type
自分で文章で答える→sentence type
->無闇にデータ量増やすだけな気がするので没案。



<!--  -->
今のところ
answer_count使用してないな。 →たしか0,1ではしようしてるかな？

＝＝＝＝＝＝＝＝＝＝＝
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