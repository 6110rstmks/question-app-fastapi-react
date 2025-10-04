# テストケース
1. レンダリング関連

初期表示

現在月が正しく表示されるか (yyyy年 MM月 形式)。

曜日ヘッダー（日〜土）が正しく並んでいるか。

日付セルが月初〜月末、前後の週も含めて正しく描画されているか。

スタイル条件

今日の日付に bg-blue-500 が付与されること。

他の月の日付は text-gray-300 で表示されること。

2. ナビゲーション（前月・翌月）

前月ボタン押下

currentDate が1ヶ月前に変更され、UIが更新されること。

翌月ボタン押下

currentDate が1ヶ月後に変更され、UIが更新されること。

3. データフェッチ関連

fetchQuestionCountsByLastAnsweredDate が呼ばれるか

現在表示中のカレンダーの日付配列 (days_array) が API に渡されること。

取得データ反映

API から返却された件数が、対応する日付セルに「〇件」と表示されること。

件数が 0 の場合は表示されないこと。

色分け

questionCount > 0 の場合は日付テキストが text-green-500 になること。

4. 日付クリック操作

問題取得処理

日付セルをクリックすると fetchProblemByDay が呼ばれること。

navigate('/problem', { state: { problemData, from: 'setProblemPage' }}) が実行されること。

5. モーダル操作

閉じるボタン

X ボタンをクリックすると setIsDisplayCalendar(false) が呼ばれること。

6. その他のUI要素

チェックボックス表示

「temporaryのみを表示する」チェックボックスが存在すること（機能未実装でも存在確認）。

7. エッジケース

月を跨いだ週表示

前後月の日付がカレンダーに正しく含まれること。

API失敗時の挙動

fetchQuestionCountsByLastAnsweredDate がエラーを返した場合でも UI がクラッシュしないこと。

fetchProblemByDay が失敗した場合

navigate が呼ばれない or エラーを正しくハンドリングすること