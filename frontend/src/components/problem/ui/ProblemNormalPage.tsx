import React, { useEffect, useState } from "react"
import { Link } from 'react-router';
import { SubcategoryWithCategoryName } from "../../../types/Subcategory";
import { Question } from "../../../types/Question";
import { fetchSubcategoriesWithCategoryNameByQuestionId } from "../../../api/SubcategoryAPI"
import styles from './ProblemNormal.module.css'
import { BlockMath } from "react-katex"
import Modal from 'react-modal'
import QuestionEditModal from "../../question/QuestionEditModal"
import ChangeCategorySubcategory from "../../ChangeCategorySubcategoryModal"
import RenderMemoWithLinks from '../../RenderMemoWithlinks'
import { SolutionStatus } from "../../../types/SolutionStatus"
import { isLatex } from "../../../utils/function"
import { handleUpdateIsCorrect } from "../../../utils/function"

interface Props {
    reviewFlg: boolean
    problem: Question
    problemData: Question[]
    currentProblemIndex: number
    problemLength: number
    showAnswer: boolean
    onShowAnswer: () => void
    onSolved: () => void
    onUnsolved: () => void
    editModalIsOpen: boolean
    setEditModalIsOpen: (isOpen: boolean) => void
    changeSubcategoryModalIsOpen: boolean
    setChangeSubcategoryModalIsOpen: (isOpen: boolean) => void
}

export const ProblemNormalPage: React.FC<Props> = ({
    reviewFlg,
    problem,
    problemData,
    currentProblemIndex,
    problemLength,
    showAnswer,
    onShowAnswer,
    onSolved,
    onUnsolved,
    editModalIsOpen,
    setEditModalIsOpen,
    changeSubcategoryModalIsOpen,
    setChangeSubcategoryModalIsOpen,
}) => {

    // Questionに関連するぱんくずリスト用
    const [
        subcategoriesWithCategoryName,
        setSubcategoriesWithCategoryName
    ] = useState<SubcategoryWithCategoryName[]>([]) 

    // ローカル状態を追加(画面で表示する用)
    const [
        localProblem,
        setLocalProblem
    ] = useState<Question>(problem) 

    // const [
    //     editModalIsOpen,
    //     setEditModalIsOpen
    // ] = useState<boolean>(false)

    useEffect(() => {
        setLocalProblem(problem)

        // problemDataも更新したい
        const updatedProblemData = problemData.map((p) => 
            p.id === problem.id ? { ...p, ...problem } : p
        )

        const fetchData = async () => {
            const data_subcategories_with_category_name = await fetchSubcategoriesWithCategoryNameByQuestionId(problem.id)
            console.log('data_subcategories_with_category_name', data_subcategories_with_category_name)
            setSubcategoriesWithCategoryName(data_subcategories_with_category_name)
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
                    {/* <div className={styles.questionLabel}>問題：{problem.last_answered_date.slice(0, 10)}</div> */}
                    <div className={styles.questionLabel}>問題：{localProblem.last_answered_date.slice(0, 10)}</div>
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
                            onClick={() => handleUpdateIsCorrect(localProblem, setLocalProblem)}

                        >
                            {localProblem?.is_correct === SolutionStatus.Incorrect ? 'incorrect' :
                            localProblem?.is_correct === SolutionStatus.Temporary ? 'temp correct' :
                            'correct'}
                        </button>
                        <button
                            className={styles.changeCategoryButton}
                            onClick={() => setChangeSubcategoryModalIsOpen(true)}
                            >Change Category or Subcategory</button>
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
                <Modal 
                    isOpen={changeSubcategoryModalIsOpen} 
                    contentLabel="カテゴリ変更モーダル">
                    <ChangeCategorySubcategory
                        categoryId={subcategoriesWithCategoryName[0]?.category_id || 0}
                        defaultCategoryName={subcategoriesWithCategoryName[0]?.category_name || ''}
                        question={localProblem}
                        setModalIsOpen={setChangeSubcategoryModalIsOpen as (isOpen: boolean) => void}
                        setSubcategoriesRelatedToQuestion={setSubcategoriesWithCategoryName}
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

