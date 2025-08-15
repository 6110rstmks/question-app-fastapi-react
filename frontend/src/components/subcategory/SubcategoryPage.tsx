import React from 'react'
import { useParams, useNavigate } from 'react-router'
import Modal from 'react-modal'
import QuestionCreate from '../question/QuestionCreateModal'
import styles from "./SubcategoryPage.module.css"
import { useSubcategoryPage } from './hooks/useSubcategoryPage'
import { 
    handleNavigateToCategoryPage,
     handleNavigateToQuestionPage 
} from '../../utils/navigate_function'
import { BlockMath } from 'react-katex'
import { SolutionStatus } from '../../types/SolutionStatus'
import { isLatex } from '../../utils/function'

const SubcategoryPage: React.FC = () => {
    const navigate = useNavigate()

    const { subcategoryId: subcategoryIdStr } = useParams<{ subcategoryId: string }>()
    const subcategoryId = Number(subcategoryIdStr)

    const { 
        modalIsOpen, 
        setModalIsOpen,
        subcategoryName, 
        setSubcategoryName, 
        questions, setQuestions, 
        categoryInfo, 
        handleDeleteSubcategory,
        showAnswer,
        setShowAnswer,
        isEditing,
        setIsEditing,
        questionCount,
        uncorrectedQuestionCount,
        handleKeyPress,
        handleSetUnsolvedProblem,
        handleSetTemporaryProblem
    } = useSubcategoryPage(subcategoryId)

    return (
        <div className={styles.subcategoryPage}>
            <div className={styles.subcategoryBox}>
                <div 
                    onClick={() => handleNavigateToCategoryPage(navigate, categoryInfo)}
                    className={styles.categoryName}
                >
                    {categoryInfo.name}＞
                </div>
                {isEditing ? (
                    <input
                        type="text"
                        value={subcategoryName}
                        onChange={(e) => setSubcategoryName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onBlur={() => setIsEditing(false)} // フォーカスを外すと編集モードを終了
                        autoFocus
                    />
                ) : (
                    <h1 
                        onDoubleClick={() => setIsEditing(true)}
                        className={styles.subcategoryName}
                    >{subcategoryName}</h1>
                )}                
                <button className={styles.deleteBtn} onClick={handleDeleteSubcategory}>Delete</button>
                <button 
                    className={styles.displayIncorrectedQuestionBtn}
                    >15日より前のincorrectの問題に絞って表示する
                </button>
            </div>
            <div>
                <div>ワードで検索する</div>
                <input 
                    type="text" 
                    placeholder="問題文を入力してください"
                    className={styles.searchInput}
                />              
            </div>
            <div className={styles.btnContainer}>
                <div>
                    <button 
                        className={`${styles.createQuestionBtn} ${showAnswer ? styles.on : styles.off}`} 
                        onClick={() => setShowAnswer((prev) => !prev)}
                    >
                        {showAnswer ? "答えを一括非表示" : "答えを一括表示"}
                    </button>
                    <button 
                        className={styles.displayIncorrectedQuestionBtn}
                        onClick={handleSetUnsolvedProblem}>
                        incorrectから問題を出題する。
                    </button>
                    <button 
                        className={styles.displayIncorrectedQuestionBtn}
                        onClick={handleSetTemporaryProblem}
                        >temporaryの問題を出題数する
                    </button>
                    <button 
                        className={styles.createQuestionBtn}
                        onClick={() => setModalIsOpen(true)}>
                            Create Question
                    </button>
                </div>
                <div>
                    <button
                        className={styles.changeCategoryBtn}
                        // onClick={()}
                    >
                            このサブカテゴリを別のカテゴリを付け替える。
                    </button>
                </div>
            </div>

            <div>

            </div>
            <h3>問題の数：{questionCount}</h3>
            <h3>未正当の問題の数：{uncorrectedQuestionCount}</h3>
            <Modal
                isOpen={modalIsOpen}
                contentLabel="Example Modal"
            >
                <QuestionCreate 
                    categoryId={categoryInfo.id} 
                    subcategoryId={subcategoryId} 
                    setModalIsOpen={setModalIsOpen}
                    setQuestions={setQuestions}
                />
            </Modal>
            <div className={styles.questionContainer}>
                {questions.map((question) => (
                    <div 
                        className={`
                            ${styles.questionBox} ${
                                question?.is_correct === SolutionStatus.Correct ? styles.correct : 
                                question?.is_correct === SolutionStatus.Temporary ? styles.temporary : 
                                styles.incorrect
                            }`} 
                        key={question.id}>
                        <h3 className={styles.problemText} 
                            onClick={() => handleNavigateToQuestionPage(
                                            navigate,
                                            question.id,
                                            categoryInfo.id,
                                            categoryInfo.name,
                                            subcategoryId,
                                            subcategoryName)}>
                            {question.problem}
                        </h3>
                        
                        {showAnswer && question.answer.map((answer, index) => (
                            <div key={index}>
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
                        ))}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default SubcategoryPage
