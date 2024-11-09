import React, { useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
        try {
            const response = await fetch('http://localhost:8000/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ problem: problem,
                                        answer: answers,
                                        category_id: category_id,
                                        subcategory_id: subcategory_id 
                                    }),
            });

            if (!response.ok) {
                throw new Error('Failed to create question');
            }

            // const data = await response.json();
            // navigate(`/subcategory/${subcategory_id}`, { state: category_id });
            await refreshQuestionList();

            setModalIsOpen(false);
        } catch (error) {
            console.error(error);
            // 必要に応じてエラーメッセージをユーザーに表示する
        }
    };

    return (
        <div className="postQuestion">
            <h1>Questionを作成</h1>
            <div className="inputPost">
                <div>Problem</div>
                <input
                    type="text"
                    placeholder="タイトルを記入"
                    value={problem}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProblem(e.target.value)}
                    autoFocus
                />
            </div>
            {answers.map((answer, index) => (
                <div key={index} className="inputPost">
                    <div>Answer {index + 1}</div>
                    <textarea
                        placeholder="投稿内容を記入"
                        value={answer}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(index, e.target.value)}
                    />
                    <button onClick={() => removeAnswerField(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addAnswerField}>Add Answer</button>
            <button className="questionButton" onClick={createQuestion}>Submit</button>
            <button onClick={() => setModalIsOpen(false)}>閉じる</button>

        </div>
    );
};

export default CreateQuestion;
