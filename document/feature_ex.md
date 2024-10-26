# タスクブランチ


## category search
***branch-name: feature/search-category***

部分一致検索

一旦表示されているページネーションのカテゴリをすべてcategoryListから削除して、
サーバから取得した部分検索に一致するカcategoriesのみを表示する。

検索ボックスを空にすると再びページネーションに基づくcategoriesをサーバから取得して表示する。

[frontend]



[backend]
条件に基づく、カテゴリデータを返すapiを作成。

<hr/>

## subcategory search
***branch-name: feature/search-subcategory***

部分一致検索


## 問題出題画面
***branch-name: feature/ask-question***

問題作成初期画面において<br>
[1]ランダムで出題するか、<br>
[2]カテゴリ、サブカテゴリに絞って出題するか選択できるようにする。

出題される問題の数をinputタグnumberで選べるようにする。(5問〜20問)
<br>
「問題を出題する」ボタンをクリックすると同時にサーバにフラグ付きのリクエストを送信して、問題のデータのレスポンスをもらう。

### カテゴリ選択の画面構図

＝＝＝＝＝＝＝＝＝
出題する問題数：「5」

◻︎カテゴリ1
　▫️サブカテゴリ1-a
　サブカテゴリ1-b
　サブカテゴリ1-c

・カテゴリ2
　サブカテゴリ2-a
　サブカテゴリ2-b


[ 問題をしゅつだいする ]←ボタン
＝＝＝＝＝＝＝＝＝

問題を一問解いて次の問題に移ると同時に、正解か不正解のフラグをサーバに送信する。
<br>
問題をすべて解ききる前にやめてしまう可能性があるため、まとめて正解不正解のフラグを送信しない。

#### カテゴリで絞って問題を出題する
***branch-name: feature/ask-question-by-category***  ← feature/ask-questionブランチから派生

問題作成はバックエンドが行うのでapi叩くだけ。

複数のカテゴリ、サブカテゴリを選択できる。




#### ランダムに問題を出題する
***branch-name: feature/ask-question-random***  ← feature/ask-questionブランチから派生

問題作成はバックエンドが行うのでapi叩くだけ。

#### Question正解フラグの手動切り替え。

SubcategoryPageからQuestionの正解できたかのフラグを自分でクリックできるようにする。


本当に作成しますか？の確認　モーダルを表示

question 作成ページ　　markdown
