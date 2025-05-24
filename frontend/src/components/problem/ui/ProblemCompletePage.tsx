import React from "react"
import { Link } from "react-router"
import styles from "./ProblemCompletePage.module.css";

interface Props {
    unsolvedCount: number
    handleNavigateToProblemReviewPage: () => void
    from?: string
    backToId?: number
}

export const ProblemCompletePage: React.FC<Props> = ({
    unsolvedCount,
    handleNavigateToProblemReviewPage,
    from,
    backToId
}) => {
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
                                onClick={handleNavigateToProblemReviewPage}
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

                {from === "categoryPage" && (
                    <div className={styles.navigationSection}>
                        <Link to={`/category/${backToId}`} className={styles.homeLink}>
                            <span className={styles.homeLinkIcon}>↩</span>
                            Back to CategoryPage
                        </Link>
                    </div>
                )}

                {from === "subcategoryPage" && (
                    <div className={styles.navigationSection}>
                        <Link to={`/subcategory/${backToId}`} className={styles.homeLink}>
                            <span className={styles.homeLinkIcon}>↩</span>
                            Back to SubcategoryPage
                        </Link>
                    </div>
                )}

                {from === "setProblemPage" && (
                <div className={styles.navigationSection}>
                    <Link to="/set_question" className={styles.homeLink}>
                        <span className={styles.homeLinkIcon}>↩</span>
                        Back to SetProblemPage
                    </Link>
                </div>
                )}
                

            </div>
        </div>
    );
};

