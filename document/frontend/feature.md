## create question page
***branch-name: feat/create-question***

問題作成画面。アンサーの部分はマークダウンで実装する必要はない。行で段落をブレイクできるようにできればいいね
作成ボタンをおしたら元のsubcategorypageに遷移する

answerの数は特に決まってないので、　プラスボタンをクリックして　アンサーの数を増やす。

<hr/>

## subcategory search
***branch-name: feat/search-subcategory***

## 問題出題画面
***branch-name: feat/ask-question***

問題出題初期画面において<br>
[1]ランダムで出題するか、<br>
[2]カテゴリ、サブカテゴリに絞って出題するか選択できるようにする。


出題される問題の数をinputタグnumberで選べるようにする。
<br>
「問題を出題する」ボタンをクリックすると同時にサーバにフラグ付きのリクエストを送信して、問題をデータのレスポンスをもらう。

問題を一問解いて次の問題に移ると同時に、正解か不正解のフラグをサーバに送信する。
<br>
50問解ききる前にやめてしまう可能性があるため、まとめて正解不正解のフラグを送信しない。

#### カテゴリで絞って問題を出題する
***branch-name: feat/ask-question-by-category***  ← feature/ask-questionブランチから派生

問題作成はバックエンドが行うのでapi叩くだけ。




#### Question正解フラグの手動切り替え。
***branch-name: feat/ask-question-by-category***  ← feature/ask-questionブランチから派生

subcategorypageにて問題のis_correct を表示させる。
チェックボックスで表現する。
SubcategoryPageからQuestionの正解できたかのフラグを自分でクリックできるようにする。



