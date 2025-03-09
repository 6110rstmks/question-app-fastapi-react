import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { SubcategoryWithCategoryName } from "../../../types/Subcategory";
import { Question } from "../../../types/Question";
import { fetchSubcategoriesWithCategoryNameByQuestionId } from "../../../api/SubcategoryAPI";
import { updateQuestionIsCorrect, fetchQuestion } from "../../../api/QuestionAPI";
import styles from './ProblemNormal.module.css'

interface Props {
    problem: Question
    currentProblemIndex: number
    problemLength: number
    showAnswer: boolean
    onShowAnswer: () => void
    onSolved: () => void
    onUnsolved: () => void
}

export const ProblemNormal: React.FC<Props> = ({
    problem,
    currentProblemIndex,
    problemLength,
    showAnswer,
    onShowAnswer,
    onSolved,
    onUnsolved
}) => {
    const [subcategoriesWithCategoryName, setSubcategoriesWithCategoryName] = useState<SubcategoryWithCategoryName[]>([])
    const [localProblem, setLocalProblem] = useState<Question>(problem) // ローカル状態を追加(画面で表示する用)

    const handleUpdateIsCorrect = async () => {
        await updateQuestionIsCorrect(localProblem!); // API コール
        const updatedProblem = await fetchQuestion(localProblem.id); // データをリフレッシュ
        setLocalProblem(updatedProblem); // 最新のデータをローカルに反映
    }

    useEffect(() => {
        setLocalProblem(problem); // 新しい問題が渡されるたびにローカル状態を更新

        fetchSubcategoriesWithCategoryNameByQuestionId(problem.id).then((data) => {
            // setSubcategories(data);
            setSubcategoriesWithCategoryName(data);
        })
    }, [problem])

    return (
        <div className={styles.problemContainer}>
            <div className={styles.header}>
                <div className={styles.pagination}>{currentProblemIndex + 1} / {problemLength}</div>
                <div className={styles.breadcrumbs}>
                    {subcategoriesWithCategoryName.map((subcategoryWithCategoryName, index) => (         
                        <div key={index} className={styles.breadcrumbPath}>
                            <Link 
                                to={`/category/${subcategoryWithCategoryName.categoryId}`}
                                className={styles.breadcrumbLink}
                            >
                                {subcategoryWithCategoryName.category_name}
                            </Link>
                            <span className={styles.breadcrumbSeparator}> ＞ </span>
                            <Link
                                to={`/subcategory/${subcategoryWithCategoryName.id}`}
                                state={{ 
                                    id: subcategoryWithCategoryName.categoryId, 
                                    name: subcategoryWithCategoryName.category_name 
                                }}
                                className={styles.breadcrumbLink}
                            >
                                {subcategoryWithCategoryName.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionLabel}>問題：</div>
                    <div className={styles.correctnessToggle}>
                        <button
                            className={`${styles.statusButton} ${
                                localProblem.is_correct ? styles.correctButton : styles.incorrectButton
                            }`}
                            onClick={handleUpdateIsCorrect}
                        >
                            {localProblem.is_correct ? '正解' : '不正解'}
                        </button>
                    </div>
                </div>
                
                <div className={styles.questionContent}>
                    {localProblem.problem}
                </div>

                {!showAnswer ? (
                    <button 
                        className={styles.showAnswerButton} 
                        onClick={onShowAnswer}
                    >
                        答えを表示する
                    </button>
                ) : (
                    <div className={styles.answerSection}>
                        <h3 className={styles.answerHeading}>答え</h3>
                        <div className={styles.answerContent}>
                            {localProblem.answer.length > 0 ? (
                                localProblem?.answer.map((answer, index) => (
                                    <div key={index} className={styles.answerItem}>
                                        {answer.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyAnswer}>解答はまだ作成されていません</p>
                            )}
                        </div>
                        
                        {localProblem.memo && (
                            <div className={styles.memoSection}>
                                <h3 className={styles.memoHeading}>メモ</h3>
                                <div className={styles.memoContent}>{localProblem.memo}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.actionButtons}>
                <button 
                    className={`${styles.actionButton} ${styles.solvedButton}`} 
                    onClick={onSolved}
                >
                    解けた
                </button>
                <button 
                    className={`${styles.actionButton} ${styles.unsolvedButton}`} 
                    onClick={onUnsolved}
                >
                    解けなかった
                </button>
            </div>
        </div>
    );
};

