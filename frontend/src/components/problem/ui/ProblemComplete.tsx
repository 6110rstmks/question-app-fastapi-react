import React from "react";
import { Link } from "react-router-dom";
import styles from "./ProblemComplete.module.css";

interface Props {
    unsolvedCount: number;
    onReview: () => void;
}

export const ProblemComplete: React.FC<Props> = ({ unsolvedCount, onReview }) => {
    return (
        <div className={styles.completeContainer}>
            <div className={styles.completeCard}>
                <h1 className={styles.completeHeading}>Complete!</h1>
                
                <div className={styles.completionStatus}>
                    {unsolvedCount > 0 ? (
                        <>
                            <p className={styles.statusMessage}>
                                {unsolvedCount}問の問題が未解決です。
                                <span className={styles.emoji}>📝</span>
                            </p>
                            <button 
                                className={styles.reviewButton} 
                                onClick={onReview}
                            >
                                解けなかった問題を再度復習する
                            </button>
                        </>
                    ) : (
                        <div className={styles.perfectScore}>
                            <p className={styles.congratsMessage}>全問正解！</p>
                            <span className={styles.congratsEmoji}>🎉</span>
                        </div>
                    )}
                </div>
                
                <div className={styles.navigationSection}>
                    <Link to="/categories/home" className={styles.homeLink}>
                        <span className={styles.homeLinkIcon}>↩</span>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

