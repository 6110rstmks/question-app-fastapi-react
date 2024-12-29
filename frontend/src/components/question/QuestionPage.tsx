import React, { useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from './QuestionPage.module.css'
import Modal from 'react-modal'
import EditQuestion from './QuestionEdit';
import ChangeCategorySubcategory from '../ChangeCategorySubcategory';
import { useQuestionPage } from './hooks/useQuestionPage'
import { fetchQuestion, updateIsCorrect, deleteQuestion } from '../../api/QuestionAPI'

const QuestionPage: React.FC = () => {
    const location = useLocation()
    const { category_id, subcategory_id, subcategoryName, categoryName } = location.state || {};
    const navigate = useNavigate()
    const { question_id } = useParams<{ question_id: string }>();
    const questionId = Number(question_id)
    const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
    const [changeModalIsOpen, setChangeModalIsOpen] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const { question, setQuestion } = useQuestionPage(questionId);

    const handleDeleteQuestion = async () => {
        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");
        if (confirmation !== '削除') {
            return;
        }
        await deleteQuestion(questionId); // API コール
        navigate('/');
    }

    const handleUpdateIsCorrect = async () => {
        await updateIsCorrect(question!); // API コール
        const data = await fetchQuestion(question!.id); // データをリフレッシュ
        setQuestion(data)
  };

  return (
      <>
        <div>
            <Link to={`/category/${category_id}`}>{categoryName}</Link>
            <span> ＞ </span>
            <Link
                to={`/subcategory/${subcategory_id}`}
                state={{ category_id }}
            >{subcategoryName}</Link>
        </div>
        <div className={styles.question_box}>
            <div className={styles.question_header}>
                <div className={styles.question_problem}>問題：{question?.problem}</div>
                <div className={styles.question_is_flg}>
                    <div
                        className={`${styles.question_is_flg_value} ${
                        question?.is_correct ? styles.correct : styles.incorrect
                        }`}
                        onClick={handleUpdateIsCorrect}
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
                DELETE
            </button>
            <button onClick={() => setEditModalIsOpen(true)}>編集</button>
            <button onClick={() => setChangeModalIsOpen(true)}>カテゴリまたは、サブカテゴリを変更する</button>
          </div>
          <Modal isOpen={editModalIsOpen} contentLabel="Example Modal">
            <EditQuestion
              setModalIsOpen={setEditModalIsOpen}
              question={question}
              setQuestion={setQuestion}
            />
          </Modal>
          <Modal isOpen={changeModalIsOpen} contentLabel="Example Modal">
            <ChangeCategorySubcategory
              setModalIsOpen={setEditModalIsOpen}
              question={question}
              setQuestion={setQuestion}
            />
          </Modal>
        </div>
      </>
  )
}

export default QuestionPage