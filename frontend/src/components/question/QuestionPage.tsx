import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from './QuestionPage.module.css'
import Modal from 'react-modal'
import EditQuestion from './QuestionEdit';
import ChangeCategorySubcategory from '../ChangeCategorySubcategory';
import { useQuestionPage } from './hooks/useQuestionPage'
import { fetchQuestion, updateQuestionIsCorrect, deleteQuestion, incrementAnswerCount } from '../../api/QuestionAPI'

const QuestionPage: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { questionId: questionIdStr } = useParams<{ questionId: string }>();
    const questionId = Number(questionIdStr)
    
    console.log(location.state)
    console.log('坂本')
    const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
    const [changeSubcategoryModalIsOpen, setChangeSubcategoryModalIsOpen] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    const { subcategories,
        setSubcategories,
        question,
        setQuestion,
        categoryInfo, 
        setCategoryInfo } = useQuestionPage(questionId, location.state);
    const { categoryId, subcategoryId, categoryName, subcategoryName } = location.state;


    const handleDeleteQuestion = async () => {
        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");
        if (confirmation !== '削除') {
            return;
        }
        await deleteQuestion(questionId); // API コール
        navigate('/');
    }
    
    const handleAnswerQuestion = () => {
        incrementAnswerCount(question!.id); // API コール

        // 表示するquestion.answer_countの数も更新
        setQuestion((prev) => {
            if (prev) {
                return {
                    ...prev,
                    answer_count: prev.answer_count + 1,
                };
            }
            return prev;
        });

        alert('回答数を更新しました');
    }

    const handleUpdateIsCorrect = async () => {
        await updateQuestionIsCorrect(question!); // API コール
        const data = await fetchQuestion(question!.id); // データをリフレッシュ
        setQuestion(data)
    }

    // このQuestionPageに遷移した元のSubcategoryPageに戻る
    const handleNavigateToPreviousSubcategoryPage = () => {
        const category = { id: categoryId, name: categoryName };
        // navigate(`/subcategory/${subcategory_id}`, {
        navigate(`/subcategory/${subcategoryId}`, {
            state: category
        });
    }

    // ページ遷移時にカテゴリ情報をローカルストレージに保存
    useEffect(() => {
      if (location.state) {
            const { category_id, subcategory_id, subcategoryName, categoryName } = location.state;
            const newCategoryInfo = { category_id, subcategory_id, subcategoryName, categoryName };
            setCategoryInfo(newCategoryInfo);
            localStorage.setItem('categoryInfo', JSON.stringify(newCategoryInfo));
      }
    }, [location.state]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {

        if (event.ctrlKey && event.key.toLowerCase() === 'b') {
            event.preventDefault();
            setShowAnswer(prev => !prev);
        }
    }, []);

    useEffect(() => {
        console.log(location.state)
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

  return (
      <>
        {subcategories.map((subcategory, index) => (         
            <div key={index}>
                <Link to={`/category/${subcategory.category_id}`}>{categoryName}</Link>
                <span> ＞ </span>
                <Link
                    to={`/subcategory/${subcategory.id}`}
                    state={{ id: categoryId, name: categoryName }}
                    // state={{ id: categoryd, name: categoryName }}
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
            <Modal isOpen={editModalIsOpen} contentLabel="Example Modal">
                <EditQuestion
                setModalIsOpen={setEditModalIsOpen}
                question={question}
                setQuestion={setQuestion}
                />
            </Modal>
            <Modal isOpen={changeSubcategoryModalIsOpen} contentLabel="Example Modal">
                <ChangeCategorySubcategory
                    setModalIsOpen={setChangeSubcategoryModalIsOpen}
                    setSubcategoriesRelatedToQuestion={setSubcategories}
                    question={question}
                    setQuestion={setQuestion}
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