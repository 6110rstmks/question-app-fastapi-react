import React, { useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./CreateQuestion.module.css"

interface CreateQuestionProps {
    category_id: number;
    subcategory_id: number;
    setModalIsOpen: (isOpen: boolean) => void;
    refreshQuestionList: () => void;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({category_id, subcategory_id, setModalIsOpen, refreshQuestionList}) => {
    const [problem, setProblem] = useState<string>('');
    const [answers, setAnswers] = useState<string[]>(['']);
    const [memo, setMemo] = useState<string>('');

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

        // メモが空の場合はエラーを表示
        if (!memo) {
            alert('メモを入力してください');
            return;
        }

        // メモが二文字以下の場合はエラーを表示
        if (memo.length < 2) {
            alert('メモは2文字以上で入力してください');
            return;
        }
        

        try {
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
        } catch (error) {
        }
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

export default CreateQuestion;
