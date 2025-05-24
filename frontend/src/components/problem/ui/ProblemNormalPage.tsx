import React, { useEffect, useState } from "react";
import { Link } from 'react-router';
import { SubcategoryWithCategoryName } from "../../../types/Subcategory";
import { Question } from "../../../types/Question";
import { fetchSubcategoriesWithCategoryNameByQuestionId } from "../../../api/SubcategoryAPI"
import { 
    updateQuestionIsCorrect,
    fetchQuestion 
} from "../../../api/QuestionAPI"
import styles from './ProblemNormal.module.css'
import { BlockMath } from "react-katex"
import Modal from 'react-modal'
import QuestionEditModal from "../../question/QuestionEditModal"
import RenderMemoWithLinks from '../../RenderMemoWithlinks'
import { SolutionStatus } from "../../../types/SolutionStatus"

interface Props {
    reviewFlg: boolean
    problem: Question
    currentProblemIndex: number
    problemLength: number
    showAnswer: boolean
    onShowAnswer: () => void
    onSolved: () => void
    onUnsolved: () => void
}

export const ProblemNormalPage: React.FC<Props> = ({
    reviewFlg,
    problem,
    currentProblemIndex,
    problemLength,
    showAnswer,
    onShowAnswer,
    onSolved,
    onUnsolved
}) => {
    const [
        subcategoriesWithCategoryName,
        setSubcategoriesWithCategoryName
    ] = useState<SubcategoryWithCategoryName[]>([]) // Questionに関連するぱんくずリスト用

    const [
        localProblem,
         setLocalProblem
    ] = useState<Question>(problem) // ローカル状態を追加(画面で表示する用)

    const [
        editModalIsOpen,
        setEditModalIsOpen
    ] = useState<boolean>(false)

    const isLatex = (text: string) => text.includes('\\')

    const handleUpdateIsCorrect = async () => {
        await updateQuestionIsCorrect(localProblem!)
        const updatedProblem = await fetchQuestion(localProblem.id)
        setLocalProblem(updatedProblem)
    }

    useEffect(() => {
        console.log('soiueoueoiu')
        setLocalProblem(problem)
        // (async () => {
        //     const data_subcategories_with_category_name = await fetchSubcategoriesWithCategoryNameByQuestionId(problem.id)
        //     setSubcategoriesWithCategoryName(data_subcategories_with_category_name);       
        // })()
        const fetchData = async () => {
            const data_subcategories_with_category_name = await fetchSubcategoriesWithCategoryNameByQuestionId(problem.id);
            setSubcategoriesWithCategoryName(data_subcategories_with_category_name);
        };
    
        fetchData()
    }, [problem])

    return (
        <div className={styles.problemContainer}>
            <div className={styles.header}>
                <div className={styles.pagination}>{currentProblemIndex + 1} / {problemLength}</div>
                <div className={styles.breadcrumbs}>
                    {subcategoriesWithCategoryName.map((subcategoryWithCategoryName, index) => (         
                        <div key={index} className={styles.breadcrumbPath}>
                            <Link 
                                to={`/category/${subcategoryWithCategoryName.category_id}`}
                                className={styles.breadcrumbLink}
                            >
                                {subcategoryWithCategoryName.category_name}
                            </Link>
                            <span className={styles.breadcrumbSeparator}> ＞ </span>
                            <Link
                                to={`/subcategory/${subcategoryWithCategoryName.id}`}
                                state={{ 
                                    id: subcategoryWithCategoryName.category_id, 
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

            {reviewFlg && (
                <h1 className={styles.title}>再出題: </h1>
            )}
            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionLabel}>問題：{problem.last_answered_date.slice(0, 10)}</div>
                    <div className={styles.correctnessToggle}>
                        <button 
                            className={styles.editButton}
                            onClick={() => setEditModalIsOpen(true)}
                            >Edit</button>
                        <button
                            className={`${styles.statusButton} ${
                                localProblem?.is_correct === SolutionStatus.Correct ? styles.correct : 
                                localProblem?.is_correct === SolutionStatus.Temporary ? styles.temporary : 
                                styles.incorrect
                            }`}
                            onClick={handleUpdateIsCorrect}
                        >
                            {localProblem?.is_correct === SolutionStatus.Incorrect ? 'incorrect' :
                            localProblem?.is_correct === SolutionStatus.Temporary ? 'temp correct' :
                            'correct'}
                        </button>
                        {/* やりかけ↓ */}
                        {/* <select
                            className={`${styles.statusDropdown} ${
                                localProblem?.is_correct === SolutionStatus.Correct ? styles.correct : 
                                localProblem?.is_correct === SolutionStatus.Temporary ? styles.temporary : 
                                styles.incorrect
                            }`}
                            value={localProblem?.is_correct}
                            onChange={(e) => handleUpdateIsCorrect(Number(e.target.value) as SolutionStatus)}
                        >
                            <option value={SolutionStatus.Incorrect}>incorrect</option>
                            <option value={SolutionStatus.Temporary}>temp correct</option>
                            <option value={SolutionStatus.Correct}>correct</option>
                        </select> */}
                    </div>
                </div>

                <Modal 
                    isOpen={editModalIsOpen} 
                    contentLabel="Example Modal">
                    <QuestionEditModal
                        setModalIsOpen={setEditModalIsOpen}
                        question={localProblem}
                        setQuestion={setLocalProblem}
                    />
                </Modal>
                
                <div className={styles.questionContent}>
                    {RenderMemoWithLinks(localProblem.problem)}
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
                        <div className={styles.answerTextBox}>
                            {localProblem.answer.length > 0 ? (
                                localProblem?.answer.map((answer, index) => (
                                    <div key={index} className={styles.answerItem}>
                                        {answer.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                            {isLatex(line) ? (
                                                <BlockMath math={line} />
                                            ) : (
                                                <>
                                                {line}
                                                <br />
                                                </>
                                            )}
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
                                <div className={styles.memoContent}>
                                    {localProblem.memo.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                        {RenderMemoWithLinks(line)}
                                        <br />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.actionButtons}>
                <button 
                    className={`
                        ${styles.actionButton} 
                        ${styles.solvedButton}
                    `} 
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

