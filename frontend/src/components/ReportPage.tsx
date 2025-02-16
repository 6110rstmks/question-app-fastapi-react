import React from 'react'
import styles from './ReportPage.module.css'


const ReportPage = () => {
  return (
    <div>
        <div className={styles.selectionType}>
            <div>今日のレポート</div>
            <div>今週のレポート</div>
            <div>二週間のレポート</div>
            <div>今月のレポート</div>
        </div>
        <button>レポートを生成</button>

        <div className={styles.reportBox}>レポートがここに表示される</div>
    </div>
  )
}

export default ReportPage