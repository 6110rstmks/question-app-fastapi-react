# 将来実装予定の案

今週・今月といた問題をグラフとして表示させる。

回答ログはanswer_logsテーブルに格納。

テーブル構造

- id
- question_id
- is_correct 正解したかどうか
- date


===========
問題詳細ページ(problemPage.tsx)からProblemを解くことができるようにする。

そして回答したら、それをanswer_logsテーブルに格納。

problemPage.tsxの問題出題画面と異なることは、問題出題画面にわざわざ飛ばなくても、QuestionPage.tsxから問題に回答してログを残せるということ。

===========<br>
githubのあるブランチ(save/log)を回答ログのデータベースとして使用する。

回答が完了したら、ブランチ(save/log)を切ってそれに対してanwswer_log/answer_log.jsonのコミットプッシュを行う。

データの集計を行う際は
ブランチ(save/log)のanswer_logディレクトリをpullして、すべてのjsonファイルを一旦dbにinsertするなどして、集計を行う。

