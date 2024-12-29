import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import styles from "./QuestionCreate.module.css"

interface QuestionCreateProps {
    category_id: number;
    subcategory_id: number;
    setModalIsOpen: (isOpen: boolean) => void;
    refreshQuestionList: () => void;
}

const QuestionCreate: React.FC<QuestionCreateProps> = ({category_id, subcategory_id, setModalIsOpen, refreshQuestionList}) => {
    const [problem, setProblem] = useState<string>('');
    const [answers, setAnswers] = useState<string[]>(['']);
    const [memo, setMemo] = useState<string>('');

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

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const addAnswerField = () => {
        setAnswers([...answers, '']);
    };

    const removeAnswerInput = (indexToRemove: number) => {
        setAnswers(answers.filter((_, index) => index !== indexToRemove));
    }

    const createQuestion = async () => {

        // 問題文が空の場合はエラーを表示
        if (!problem) {
            alert('問題文を入力してください');
            return;
        } 

        const response = await fetch('http://localhost:8000/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                                    problem: problem,
                                    answer: answers,
                                    memo: memo,
                                    category_id: category_id,
                                    subcategory_id: subcategory_id 
                                }),
        });

        if (!response.ok) {
            throw new Error('Failed to create question');
        }

        await refreshQuestionList();
        setModalIsOpen(false);
    };

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
                                value={memo}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMemo(e.target.value)}
                                className={styles.memoInput}
                            />
                    </div>

                    <div className={styles.footer}>
                        <button onClick={createQuestion} className={styles.primaryButton}>
                            Save
                        </button>
                    </div>   
                    <div>                        
                        <button onClick={() => setModalIsOpen(false)}>閉じる</button>
                    </div> 
                </div>        
            </div>
    );
};

export default QuestionCreate;

