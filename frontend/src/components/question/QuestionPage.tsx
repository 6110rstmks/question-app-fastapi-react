import { get } from 'http';
import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from './QuestionPage.module.css'
import Modal from 'react-modal'
import EditQuestion from '../EditQuestion';
import ChangeCategorySubcategory from '../ChangeCategorySubcategory';

export interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
    is_correct: boolean;
    subcategory_id: number;
}

const QuestionPage: React.FC = () => {
    const location = useLocation()
    const { category_id, subcategory_id, subcategoryName, categoryName } = location.state || {};
    const navigate = useNavigate()
    const { question_id } = useParams<{ question_id: string }>();
    const [question, setQuestion] = useState<Question>();
    const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
    const [changeModalIsOpen, setChangeModalIsOpen] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    const handleDeleteQuestion = async () => {
        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");
        if (confirmation !== '削除') {
            return;
        }

        const response = await fetch(`http://localhost:8000/questions/${question_id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete subcategory');
        }
        navigate('/');
    }

    // idからquestionを取得
    const getQuestion = async () => {
        const response = await fetch(`http://localhost:8000/questions/${question_id}`);
        if (response.ok) {
            const data = await response.json();
            setQuestion(data)
        }
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
        <div>
            <Link to={`/category/${category_id}`}>{categoryName}</Link>
            <Link
                to={`/subcategory/${subcategory_id}`}
                state={{ category_id }}
            >         
                {subcategoryName}
            </Link>
        </div>
        <div className={styles.question_box}>
            <div className={styles.question_header}>
                <div className={styles.question_problem}>問題：{question?.problem}</div>
                <div className={styles.question_is_flg}>
                    <div
                        className={`${styles.question_is_flg_value} ${
                        question?.is_correct ? styles.correct : styles.incorrect
                        }`}
                        onClick={updateIsCorrect}
                    >
                {question?.is_correct ? '正解' : '不正解'}
              </div>
            </div>
          </div>
          <div>
          <div className={styles.answer_container}>
            <div
              className={`${styles.answer_toggle} ${
                showAnswer ? styles.show : ''
              }`}
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? '答えを隠す' : '答えを表示する'}
            </div>
            <div
              className={`${styles.answer_text} ${
                showAnswer ? styles.show : ''
              }`}
            >
              {question?.answer.map((answer, index) => (
                <div key={index}>・{answer}</div>
              ))}
            </div>
          </div>
          </div>
          <div className={styles.question_actions}>
            <button onClick={handleDeleteQuestion} className={styles.delete}>
                削除
            </button>
            <button onClick={() => setEditModalIsOpen(true)}>編集</button>
            <button onClick={() => setChangeModalIsOpen(true)}>カテゴリまたは、サブカテゴリを変更する</button>
          </div>
          <Modal isOpen={editModalIsOpen} contentLabel="Example Modal">
            <EditQuestion
              setModalIsOpen={setEditModalIsOpen}
              question={question}
              refreshQuestion={getQuestion}
            />
          </Modal>
          <Modal isOpen={changeModalIsOpen} contentLabel="Example Modal">
            <ChangeCategorySubcategory
              setModalIsOpen={setChangeModalIsOpen}
              question={question}
              refreshQuestion={getQuestion}
            />
          </Modal>
        </div>
      </>
  )
}

export default QuestionPage