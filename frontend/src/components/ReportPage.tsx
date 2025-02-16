import React from 'react'
import styles from './ReportPage.module.css'


const ReportPage = () => {
  return (
    <div>
        <div className={styles.selectionType}>
            <div>
                <input type="checkbox" name="" id="" />
                <span>今日のレポート</span>
            </div>
            <div>
                <input type="checkbox" name="" id="" />
                <span>今週のレポート</span>
            </div>
            <div>
                <input type="checkbox" name="" id="" />
                <span>二週間のレポート</span>
            </div>
            <div>
                <input type="checkbox" name="" id="" />
                <span>今月のレポート</span>
            </div>
        </div>

        <button className={styles.createReportBtn}>レポートを生成</button>

        <div className={styles.reportBox}>レポートがここに表示される</div>
    </div>
  )
}

export default ReportPage