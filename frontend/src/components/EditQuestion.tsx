import React from 'react'
import styles from './EditQuestion.module.css'
import { useState, useEffect } from 'react'


interface Question {
    id: number;
    problem: string;
    answer: string[];
    is_correct: boolean;
    subcategory_id: number;
}

interface EditQuestionProps {
  setModalIsOpen: (isOpen: boolean) => void;
  question?: Question;
  refreshQuestion: () => void; // Add this prop
}


const EditQuestion: React.FC<EditQuestionProps> = ({setModalIsOpen, question, refreshQuestion}) => {
    const [inputProblemValue, setInputProblemValue] = useState<string>(question?.problem || "");
    const [inputAnswerValue, setInputAnswerValue] = useState<string[]>(question?.answer || ['']);
    const [isCorrect, setIsCorrect] = useState<boolean>(question?.is_correct || false);


    // 入力値が変更されたときの処理
    const handleProblemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputProblemValue(event.target.value);
    };

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedAnswers = [...inputAnswerValue]; // 配列のコピーを作成
        updatedAnswers[index] = event.target.value;   // 対象のインデックスを更新
        setInputAnswerValue(updatedAnswers);
    }

    // 正解/不正解の選択変更処理
    const handleIsCorrectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCorrect(event.target.value === 'true');
    };

    const updateQuestion = async () => {

        const updatedQuestion = {
            problem: inputProblemValue,
            answer: inputAnswerValue,
            is_correct: isCorrect
            // subcategory_id: question?.subcategory_id,
        };

        try {
            // const response = await fetch(`/questions/${question?.id}`, {
            const response = await fetch('http://localhost:8000/questions/74', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedQuestion),
            });

            if (!response.ok) {
                throw new Error('Failed to update the question.');
            }
            refreshQuestion(); // Refresh the question

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
        setIsCorrect(question?.is_correct ?? false);

      }, [question]);

    return (
        <div>
            <div className={styles.problem_textbox}>
                問題:
            <input 
                type='text'
                value={inputProblemValue}
                onChange={handleProblemChange}
                className={styles.question_problem}
            />
            </div>
            <div>答え</div>
            {question?.answer.map((answer, index) => (
                <div className={styles.question_row}>
                    <span className={styles.question_dot}>・</span>
                    <input 
                        type='text'
                        value={inputAnswerValue[index]}
                        onChange={(event) => handleAnswerChange(event, index)}
                        className={styles.question_problem}

                    />
                </div>
            ))}

                        {/* 正解/不正解のラジオボタン */}
                        <div className={styles.radio_group}>
                <label>
                    <input
                        type="radio"
                        value="true"
                        checked={isCorrect === true}
                        onChange={handleIsCorrectChange}
                    />
                    正解
                </label>
                <label>
                    <input
                        type="radio"
                        value="false"
                        checked={isCorrect === false}
                        onChange={handleIsCorrectChange}
                    />
                    不正解
                </label>
            </div>

            
            <button onClick={updateQuestion}>送信</button>
        </div>
    )
}

export default EditQuestion