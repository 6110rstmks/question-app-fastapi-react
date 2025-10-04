# コードリファクタリング案

## 目的を見直す
コンポーネントと状態を分けたことで、コードが整理され、拡張や変更が容易になる。

## 参考サイト

https://hello.shelfy.co.jp/960cf4736e4d4a6a87161c34bac17fac
https://buildersbox.corp-sansan.com/entry/2023/12/10/000000

## component設計の見直し

### 分割粒度について
Atomic designを参考にすべきか。
https://zenn.dev/tenta_shiratori/articles/8e368a916b418a
↑atomic design は使われなくなったらしい。

単一責任の原則

債務分離

# ディレクトリ構成について考える
https://zenn.dev/tenta_shiratori/articles/9be477249f8d80

# 関数
引数に指定するid(category_id, subcategory_id)のデータ型は全てnumberに統一

## 関数名の統一

- onclickイベントなどのイベントで発火する関数はあたまにhandleとつける。
<br>
handleAddCategory

- ページ遷移を行う関数<br>
例）
handleNavigateToCategoryPage(CategoryBox.tsx)

- Category,Subcategory,Questionを追加する関数<br>
例）
handleAddCategory, handleAddSubcategory

- Category,Subcategory,Questionを削除する関数<br>
例）
handleDeleteCategory

- idからモデル全体（Category,Subcategory,Question）を取得するAPIを叩く関数<br>
fetchCategory, fetchSubcategory



## 変数、関数名の命名規則
countはcntと略さず、countとする。
buttonはbtnと略さず、buttonとする。


## 無理に共通化をしない方が自然な関数
handleAddSubcategory(CategoryBox.tsx, CategoryPage.tsx)