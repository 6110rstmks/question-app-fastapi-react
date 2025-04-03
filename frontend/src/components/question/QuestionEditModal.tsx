import styles from './QuestionEdit.module.css'
import React,{ ChangeEvent } from 'react'
import { Question } from '../../types/Question'
import { useQuestionEdit } from './hooks/useQuestionEdit'

interface QuestionEditProps {
    setModalIsOpen: (isOpen: boolean) => void;
    question?: Question;
    setQuestion: (question: Question) => void;
}

enum SolutionStatus {
    NOT_SOLVED = 0,
    TEMPORARY_SOLVED = 1,
    PERMANENT_SOLVED = 2,
}

const QuestionEditModal: React.FC<QuestionEditProps> = ({
    setModalIsOpen,
    question,
    setQuestion,
}) => {

    const { 
        inputProblemValue,
        inputAnswerValue,
        isCorrect,
        inputMemoValue,
        setInputMemoValue,
        updateQuestion,
        addAnswerInput,
        removeAnswerInput,
        handleProblemChange,
        handleIsCorrectChange,
        handleCloseModal,
        handleAnswerChange
    } = useQuestionEdit(
        question, 
        setQuestion, 
        setModalIsOpen
    )

    return (   
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Edit Question</h2>
            </div>
            
            <div className={styles.content}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Problem:</label>
                    <input 
                        type='text'
                        value={inputProblemValue}
                        onChange={handleProblemChange}
                        className={styles.textInput}
                    />
                </div>

                <div className={styles.answerContainer}>
                    <div className={styles.answerHeader}>
                        <label className={styles.label}>Answer:</label>
                        <button 
                            onClick={addAnswerInput} 
                            className={styles.secondaryButton}
                        >
                            答えを追加
                        </button>
                    </div>
                    
                    {inputAnswerValue.map((answer, index) => (
                        <div key={index} className={styles.answerRow}>
                            <textarea 
                                placeholder="投稿内容を記入"
                                value={answer}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(index, event.target.value)}
                                className={styles.answerInput}
                            />
                            {inputAnswerValue.length > 1 && (
                                <button 
                                    onClick={() => removeAnswerInput(index)}
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>判定:</label>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value={SolutionStatus.PERMANENT_SOLVED.toString()}  // ここを修正
                                checked={isCorrect === SolutionStatus.PERMANENT_SOLVED}  // 修正
                                onChange={handleIsCorrectChange}
                                className={styles.radio}
                            />
                            正解
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value={SolutionStatus.TEMPORARY_SOLVED.toString()}  // ここを修正
                                checked={isCorrect === SolutionStatus.TEMPORARY_SOLVED}  // 修正
                                onChange={handleIsCorrectChange}
                                className={styles.radio}
                            />
                            一時的に正解
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value={SolutionStatus.NOT_SOLVED.toString()}  // ここを修正
                                checked={isCorrect === SolutionStatus.NOT_SOLVED}  // 修正
                                onChange={handleIsCorrectChange}
                                className={styles.radio}
                            />
                            不正解
                        </label>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Memo:</label>
                    <textarea
                        value={inputMemoValue}
                        onChange={(e) => setInputMemoValue(e.target.value)}
                        className={styles.memoInput}
                    />
                </div>

                <div className={styles.footer}>
                    {/* <button onClick={() => setModalIsOpen(false)} className={`${styles.secondaryButton} ${styles.closeButton}`}> */}
                    <button onClick={handleCloseModal} className={`${styles.secondaryButton} ${styles.closeButton}`}>
                        Close
                    </button>      
                    <button onClick={updateQuestion} className={styles.primaryButton}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuestionEditModal