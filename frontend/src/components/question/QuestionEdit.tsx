import React from 'react'
import styles from './QuestionEdit.module.css'
import { useState, useEffect, useCallback, ChangeEvent } from 'react'
import { Question } from '../../types/Question'
import { fetchQuestion } from '../../api/QuestionAPI'

interface QuestionEditProps {
    setModalIsOpen: (isOpen: boolean) => void;
    question?: Question;
    setQuestion: (question: Question) => void;
}

const QuestionEdit: React.FC<QuestionEditProps> = ({setModalIsOpen, question, setQuestion}) => {
    const [inputProblemValue, setInputProblemValue] = useState<string>(question?.problem || "")
    const [inputAnswerValue, setInputAnswerValue] = useState<string[]>(question?.answer || [''])
    const [inputMemoValue, setInputMemoValue] = useState<string>(question?.memo || "")
    const [isCorrect, setIsCorrect] = useState<boolean>(question?.is_correct || false)

    // タッチパッド誤操作のブラウザバックを防ぐ
    const blockBrowserBack = useCallback(() => {
        window.history.go(1)
    }, [])
    
    useEffect(() => {
        // 直前の履歴に現在のページを追加
        window.history.pushState(null, '', window.location.href)
    
        // 直前の履歴と現在のページのループ
        window.addEventListener('popstate', blockBrowserBack)
    
        // クリーンアップは忘れない
        return () => {
            window.removeEventListener('popstate', blockBrowserBack)
        }
    }, [blockBrowserBack])

    const handleProblemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputProblemValue(event.target.value);
    };

    // const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const handleAnswerChange = (index: number, value: string) => {
        const updatedAnswers = [...inputAnswerValue];
        updatedAnswers[index] = value;
        setInputAnswerValue(updatedAnswers);
    }

    const handleIsCorrectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCorrect(event.target.value === 'true');
    }

    const addAnswerInput = () => {
        setInputAnswerValue([...inputAnswerValue, '']);
    }

    const removeAnswerInput = (indexToRemove: number) => {
        setInputAnswerValue(inputAnswerValue.filter((_, index) => index !== indexToRemove));
    }

    const handleCloseModal = () => {
        let confirmation = prompt("本当にCloseしますか？　「Y」と入力");
        if (confirmation !== 'Y') {
            return;
        }
        setModalIsOpen(false);
    }

    const updateQuestion = async () => {
        const updatedQuestion = {
            problem: inputProblemValue,
            answer: inputAnswerValue,
            memo: inputMemoValue,
            is_correct: isCorrect
        };

        try {
            const response = await fetch(`http://localhost:8000/questions/${question?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedQuestion),
            });

            if (!response.ok) {
                throw new Error('Failed to update the question.');
            }
            
            const data = await fetchQuestion(question!.id);
            setQuestion(data);
            alert('質問が更新されました！');
            setModalIsOpen(false);
        } catch (error) {
            console.error(error);
            alert('質問の更新に失敗しました。');
        }
    };

    useEffect(() => {
        setInputProblemValue(question?.problem || "");
        setInputAnswerValue(question?.answer || ['']);
        setInputMemoValue(question?.memo || "");
        setIsCorrect(question?.is_correct ?? false);
    }, [question]);

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
                                value="true"
                                checked={isCorrect === true}
                                onChange={handleIsCorrectChange}
                                className={styles.radio}
                            />
                            Correct
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                value="false"
                                checked={isCorrect === false}
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

export default QuestionEdit