import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom';
import styles from './QuestionPage.module.css'
import Modal from 'react-modal'
import QuestionEditModal from './QuestionEditModal';
import ChangeCategorySubcategory from '../ChangeCategorySubcategory';
import { useQuestionPage } from './hooks/useQuestionPage'

interface QuestionPageNavigationParams {
    categoryId: number,
    subcategoryId: number,
    categoryName: string,
    subcategoryName: string
}

const QuestionPage: React.FC = () => {
    const location = useLocation()
    const { questionId: questionIdStr } = useParams<{ questionId: string }>();
    const questionId = Number(questionIdStr)

    const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
    const [
        changeSubcategoryModalIsOpen,
        setChangeSubcategoryModalIsOpen
    ] = useState<boolean>(false);

    // location.stateがnullの場合にlocalStorageから取得
    const state: QuestionPageNavigationParams = location.state || JSON.parse(localStorage.getItem('categorySubcategoryInfo') || '{}');

    const { 
        categoryId,
        subcategoryId,
        categoryName,
        subcategoryName
    } = state;

    const { 
        subcategories,
        setSubcategories,
        question,
        setQuestion,
        showAnswer,
        setShowAnswer,
        handleDeleteQuestion,
        handleAnswerQuestion,
        handleUpdateIsCorrect,
        handleNavigateToPreviousSubcategoryPage
    } = useQuestionPage(
        categoryId,
        subcategoryId,
        questionId,
        categoryName
    );

    // ページ遷移時にカテゴリ情報をローカルストレージに保存
    useEffect(() => {
      if (location.state) {
            localStorage.setItem('categorySubcategoryInfo', JSON.stringify(location.state));
      }
    }, [location.state]);

  return (
      <>
        {subcategories.map((subcategory, index) => (         
            <div key={index}>
                <Link to={`/category/${categoryId}`}>{categoryName}</Link>
                <span> ＞ </span>
                <Link
                    to={`/subcategory/${subcategory.id}`}
                    state={{ id: categoryId, name: categoryName }}
                >{subcategory.name}</Link>
            </div>
        ))  }
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
                        <div key={index}>
                            {answer.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            </div>
            <button onClick={handleNavigateToPreviousSubcategoryPage}>Back to サブカテゴリ内のQuestion一覧</button>
            <div className={styles.question_actions}>
                <button onClick={handleDeleteQuestion} className={styles.delete}>
                    DELETE
                </button>
                <button onClick={handleAnswerQuestion}>この問題を回答した！</button>
                <button onClick={() => setEditModalIsOpen(true)}>Edit</button>
                <button onClick={() => setChangeSubcategoryModalIsOpen(true)}>Change subcategory or category</button>
            </div>
            <Modal 
                isOpen={editModalIsOpen} 
                contentLabel="Example Modal">
                <QuestionEditModal
                    setModalIsOpen={setEditModalIsOpen}
                    question={question}
                    setQuestion={setQuestion}
                />
            </Modal>
            <Modal 
                isOpen={changeSubcategoryModalIsOpen} 
                contentLabel="Example Modal">
                <ChangeCategorySubcategory
                    setModalIsOpen={setChangeSubcategoryModalIsOpen}
                    setSubcategoriesRelatedToQuestion={setSubcategories}
                    categoryName={categoryName}
                    question={question}
                    categoryId={categoryId}
                />
            </Modal>
            <div>
                {question?.memo && (
                    <div className={styles.memo}>
                        <h3>メモ</h3>
                        <p>
                        {question.memo.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                            {line}
                            <br />
                            </React.Fragment>
                        ))}
                        </p>
                    </div>
                )}
            </div>
        </div>
        <h1>ctr + b で問題を表示・非表示</h1>
        <div>この問題を回答した回数{question?.answer_count}</div>
      </>
  )
}

export default QuestionPage