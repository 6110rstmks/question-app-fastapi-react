import React from 'react'
import styles from './EditQuestion.module.css'
import { useState, useEffect } from 'react'

interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
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
    const [inputMemoValue, setInputMemoValue] = useState<string>(question?.memo || "");
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
    }

    const addAnswerInput = () => {
        setInputAnswerValue([...inputAnswerValue, '']);
    }

    const removeAnswerInput = (indexToRemove: number) => {
        setInputAnswerValue(inputAnswerValue.filter((_, index) => index !== indexToRemove));
    }

    const updateQuestion = async () => {

        const updatedQuestion = {
            problem: inputProblemValue,
            answer: inputAnswerValue,
            memo: inputMemoValue,
            is_correct: isCorrect
        };

        try {
            // const response = await fetch(`/questions/${question?.id}`, {
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
        setInputMemoValue(question?.memo || "");
        setIsCorrect(question?.is_correct ?? false);

      }, [question]);

    return (
        <div>
            <h2>問題の編集</h2>
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
            {inputAnswerValue.map((answer, index) => (
                <div key={index} className={styles.question_row}>
                    <span className={styles.question_dot}>・</span>
                    <input 
                        type='text'
                        value={answer}
                        onChange={(event) => handleAnswerChange(event, index)}
                        className={styles.question_problem}
                    />
                    {inputAnswerValue.length > 1 && (
                        <button 
                            onClick={() => removeAnswerInput(index)}
                            className={styles.remove_button}
                        >
                            削除
                        </button>
                    )}
                </div>
            ))}

            <button 
                onClick={addAnswerInput} 
                className={styles.add_button}
            > 答えを追加</button>


            <div className={styles.radio_group}>
                <div>判定：</div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="true"
                            checked={isCorrect === true}
                            onChange={handleIsCorrectChange}
                        />
                        正解
                    </label>
                </div>
                <div>
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
            </div>
            
            <div>
                メモ
                {inputMemoValue}
            </div>

            <button onClick={updateQuestion}>送信</button>
        </div>
    )
}

export default EditQuestion