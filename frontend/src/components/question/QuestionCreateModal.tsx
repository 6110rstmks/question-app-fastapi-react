import React, { useState, ChangeEvent } from 'react';
import styles from "./QuestionCreateModal.module.css"
import { Question } from '../../types/Question'
import { useQuestionCreateModal } from './hooks/useQuestionCreateModal'
interface QuestionCreateProps {
    categoryId: number;
    subcategoryId: number;
    setModalIsOpen: (isOpen: boolean) => void;
    setQuestions: (questions: Question[]) => void;
}

const QuestionCreateModal: React.FC<QuestionCreateProps> = ({
    categoryId,
    subcategoryId,
    setModalIsOpen,
    setQuestions
}) => {
    const {
        problem,
        setProblem,
        answers,
        inputMemoValue,
        setInputMemoValue,
        removeAnswerInput,
        createQuestion,
        handleAnswerChange,
        addAnswerField,
    } = useQuestionCreateModal(
        categoryId,
        subcategoryId,
        setQuestions,
        setModalIsOpen
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Create Question</h2>
            </div>

            <div className={styles.content}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Problem:</label>
                    <input
                            type="text"
                            placeholder="問題文を入力"
                            value={problem}
                            className={styles.textInput}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setProblem(e.target.value)}
                            autoFocus
                        />
                    </div>

                <div className={styles.answerContainer}>
                    <div className={styles.answerHeader}>
                        <label className={styles.label}>Answer:</label>
                        <button 
                            onClick={addAnswerField} 
                            className={styles.secondaryButton}
                        >
                            答えを追加
                        </button>
                    </div>

                    {answers.map((answer, index) => (
                        <div key={index} className={styles.answerRow}>
                            <textarea
                                placeholder="投稿内容を記入"
                                className={styles.answerInput}
                                value={answer}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(index, e.target.value)}
                            />
                        {answers.length > 1 && (
                            <button 
                                onClick={() => removeAnswerInput(index)}
                                className={styles.deleteButton}
                            >
                                削除
                            </button>
                        )}               
                        </div>
                    ))}
                </div>

                    <div className={styles.formGroup}>
                            <label className={styles.label}>Memo:</label>
                            <textarea
                                value={inputMemoValue}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputMemoValue(e.target.value)}
                                className={styles.memoInput}
                            />
                    </div>

                    <div className={styles.footer}>
                        <button 
                            onClick={createQuestion} 
                            className={styles.primaryButton}
                        >
                            Save
                        </button>
                    </div>   
                    <div>                        
                        <button 
                            onClick={() => setModalIsOpen(false)}
                        >
                            Close
                        </button>
                    </div> 
                </div>        
            </div>
    );
};

export default QuestionCreateModal;

