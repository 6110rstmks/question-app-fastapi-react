import { get } from 'http';
import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from './QuestionPage.module.css'
import Modal from 'react-modal'
import EditQuestion from './EditQuestion';


export interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
    is_correct: boolean;
    subcategory_id: number;
}

const QuestionPage: React.FC = () => {
  // const location = useLocation() as LocationState;
  const location = useLocation()
  const { subcategoryName, categoryName } = location.state || {};

  
  const navigate = useNavigate()
  const { question_id } = useParams<{ question_id: string }>();
  const [question, setQuestion] = useState<Question>();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const handleDelete = async () => {

    let confirmation = prompt("削除を実行するには、「削除」と入力してください:");
    
    if (confirmation !== '削除') {
        return;
    }

    const response = await fetch(`http://localhost:8000/questions/${question_id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete subcategory');
    }
    navigate('/');
}

  const getQuestion = async () => {
    const response = await fetch(`http://localhost:8000/questions/${question_id}`);
    if (response.ok) {
        const data = await response.json();
        setQuestion(data);}
  }

  const updateIsCorrect = async () => {
    const response = await fetch(`http://localhost:8000/questions/edit_flg/${question_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
                                is_correct: !question?.is_correct 
                            }),
    });
    if (!response.ok) {
        throw new Error('Failed to update is_correct');
    }
    getQuestion();
  }

  useEffect(() => {
    getQuestion();
  }, [])

  return (
    <>
        <div>{categoryName}＞{subcategoryName} ＞ {question?.problem}</div>
        <div className={styles.question_box}>
          <div className={styles.question_problem}>問題：{question?.problem}</div>
          <div className={styles.question_is_flg}>
              正解したかどうか：<div className={styles.question_is_flg_value} onClick={updateIsCorrect}>{question?.is_correct ? '正解' : '不正解'}</div>
          </div>
          <div>
              <p className={styles.question_answer}>答え</p>
              {question?.answer.map((answer, index) => (
                <div className='answer' key={index}>・{answer}</div>
              ))}
          </div>
          <div className={styles.question_delete}>
              <button onClick={handleDelete}>削除</button>
          </div>
          <button onClick={() => setModalIsOpen(true)}>編集</button>
          <button>サブカテゴリを変更する→モジュールがひらいて、同一カテゴリ内のサブカテゴリを選択できるようにする。</button>
          <Modal
                isOpen={modalIsOpen}
                contentLabel="Example Modal"
            >
                <EditQuestion 
                    // category_id={categoryId} 
                    // subcategory_id={subcategoryId} 
                    setModalIsOpen={setModalIsOpen}
                    question={question}
                    refreshQuestion={getQuestion}
                />
            </Modal>
      </div>
    </>
  )
}

export default QuestionPage