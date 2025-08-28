import styles from './QuestionEdit.module.css'
import React from 'react'
import type { ChangeEvent } from 'react'
import type { Question } from '../../types/Question'
import { useQuestionEditModal } from './hooks/useQuestionEditModal'
import { SolutionStatus } from '../../types/SolutionStatus'

interface QuestionEditProps {
    setModalIsOpen: (isOpen: boolean) => void
    question?: Question
    setQuestion: (question: Question) => void
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
        setInputAnswerValue,
        updateQuestion,
        setInputProblemValue,
        handleIsCorrectChange,
        handleCloseModal,
        handleAnswerChange
    } = useQuestionEditModal(
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
                    <textarea
                        placeholder="問題文を記入"
                        value={inputProblemValue}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputProblemValue(e.target.value)}
                        className={styles.textInput}
                    ></textarea>
                </div>

                <div className={styles.answerContainer}>
                    <div className={styles.answerHeader}>
                        <label className={styles.label}>Answer:</label>
                        <button 
                            onClick={() => setInputAnswerValue([...inputAnswerValue, ''])}
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
                                onClick={() =>
                                    setInputAnswerValue(inputAnswerValue.filter((_, i) => i !== index))
                                  }
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
                                value={SolutionStatus.Correct.toString()} 
                                checked={isCorrect === SolutionStatus.Correct} 
                                onChange={handleIsCorrectChange}
                                className={styles.radio}
                            />
                            Correct
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value={SolutionStatus.Temporary.toString()}
                                checked={isCorrect === SolutionStatus.Temporary}
                                onChange={handleIsCorrectChange}
                                className={styles.radio}
                            />
                            Temporary
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value={SolutionStatus.Incorrect.toString()} 
                                checked={isCorrect === SolutionStatus.Incorrect}
                                onChange={handleIsCorrectChange}
                                className={styles.radio}
                            />
                            Incorrect
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
                    <button 
                        onClick={handleCloseModal} 
                        className={`${styles.secondaryButton} ${styles.closeButton}`}
                    >
                        Close
                    </button>      
                    <button 
                        onClick={updateQuestion} 
                        className={styles.primaryButton}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuestionEditModal