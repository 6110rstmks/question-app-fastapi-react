# コードリファクタリング案

## 目的を見直す
コンポーネントと状態を分けたことで、コードが整理され、拡張や変更が容易になる。


## 参考サイト

https://hello.shelfy.co.jp/960cf4736e4d4a6a87161c34bac17fac
https://buildersbox.corp-sansan.com/entry/2023/12/10/000000

## component設計の見直し

### 分割粒度について
Atomic designを参考にすべきか。

単一責任の原則

債務分離

## 関数名の統一

- ページ遷移を行う関数<br>
例）
handleNavigateToCategoryPage(CategoryBox.tsx)

- Category,Subcategory,Questionを追加する関数<br>
例）
handleAddCategory, handleAddSubcategory

