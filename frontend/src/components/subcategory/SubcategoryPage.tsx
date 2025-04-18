import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Modal from 'react-modal'
import QuestionCreate from '../question/QuestionCreateModal';
import styles from "./SubcategoryPage.module.css";
import { useSubcategoryPage } from './hooks/useSubcategoryPage';
import { handleNavigateToCategoryPage, handleNavigateToQuestionPage } from '../../utils/navigate_function';
import { BlockMath } from 'react-katex'

const SubcategoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const { subcategoryId: subcategoryIdStr } = useParams<{ subcategoryId: string }>();
    const subcategoryId = Number(subcategoryIdStr)

    const isLatex = (text: string) => text.includes('\\')


    enum SolutionStatus {
        NOT_SOLVED = 0,
        TEMPORARY_SOLVED = 1,
        PERMANENT_SOLVED = 2,
    }

    const { subcategoryName, 
        setSubcategoryName, 
        questions, setQuestions, 
        categoryInfo, 
        handleDeleteSubcategory,
        showAnswer,
        setShowAnswer,
        isEditing,
        setIsEditing,
        uncorrectedQuestionCnt,
        handleKeyPress,
        handleSetProblem
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
            </div>
            <button 
                className={`${styles.createQuestionBtn} ${showAnswer ? styles.on : styles.off}`} 
                onClick={() => setShowAnswer((prev) => !prev)}
            >
                {showAnswer ? "答えを一括非表示" : "答えを一括表示"}
            </button>
            <button 
                className={styles.displayIncorrectedQuestionBtn}
                onClick={handleSetProblem}>
                このサブカテゴリから問題を出題する。
            </button>
            <button 
                className={styles.createQuestionBtn}
                onClick={() => setModalIsOpen(true)}>
                    Create Question
            </button>
            <button 
                className={styles.displayIncorrectedQuestionBtn}
                >未正解の問題に絞って表示する
            </button>
            <h2>未正当の問題の数：{uncorrectedQuestionCnt}</h2>
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
                                question?.is_correct === SolutionStatus.PERMANENT_SOLVED ? styles.correct : 
                                question?.is_correct === SolutionStatus.TEMPORARY_SOLVED ? styles.temporary : 
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
    );
};

export default SubcategoryPage;
