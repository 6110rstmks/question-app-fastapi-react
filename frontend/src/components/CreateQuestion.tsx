import React, { useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./CreateQuestion.module.css"

// interface LocationState {
//     subcategory_id: number;
//     category_id: number;
// }

interface CreateQuestionProps {
    category_id: number;
    subcategory_id: number;
    setModalIsOpen: (isOpen: boolean) => void;
    refreshQuestionList: () => void;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({category_id, subcategory_id, setModalIsOpen, refreshQuestionList}) => {
    const location = useLocation();
    // const { subcategory_id, category_id } = location.state as LocationState;
    const [problem, setProblem] = useState<string>('');
    const [answers, setAnswers] = useState<string[]>(['']);
    const [memo, setMemo] = useState<string>('');
    const navigate = useNavigate();

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const addAnswerField = () => {
        setAnswers([...answers, '']);
    };

    const removeAnswerField = (index: number) => {
        setAnswers(answers.filter((_, i) => i !== index));
    };

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
        <div className="postQuestion">
            <h1>Questionを作成</h1>
            <div className="inputPost">
                <div>Problem</div>
                <input
                    type="text"
                    placeholder="問題文を入力"
                    value={problem}
                    className={styles.input_problem}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProblem(e.target.value)}
                    autoFocus
                />
            </div>
            {answers.map((answer, index) => (
                <div key={index} className="inputPost">
                    <div>Answer {index + 1}</div>
                    <textarea
                        placeholder="投稿内容を記入"
                        className={styles.input_problem}
                        value={answer}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(index, e.target.value)}
                    />
                    <button onClick={() => removeAnswerField(index)}>Remove</button>
                </div>
            ))}
            <div>
                <input 
                    type="text"
                    placeholder='メモを入力'
                    value={memo}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMemo(e.target.value)}
                />
            </div>
            <button onClick={addAnswerField}>Add Answer</button>
            <button className="questionButton" onClick={createQuestion}>Submit</button>
            <button onClick={() => setModalIsOpen(false)}>閉じる</button>

        </div>
    );
};

export default CreateQuestion;
