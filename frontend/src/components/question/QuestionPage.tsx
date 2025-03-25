import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom';
import styles from './QuestionPage.module.css'
import Modal from 'react-modal'
import QuestionEditModal from './QuestionEditModal';
import ChangeCategorySubcategory from '../ChangeCategorySubcategory';
import { useQuestionPage } from './hooks/useQuestionPage'
import { BlockMath } from 'react-katex'


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

    const isLatex = (text: string) => text.includes('\\')


    const { 
        categoryId,
        subcategoryId,
        categoryName,
        subcategoryName
    } = state;

    const { 
        subcategoriesWithCategoryName,
        setSubcategoriesWithCategoryName,
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
        console.log(location.state)
      if (location.state) {
            localStorage.setItem('categorySubcategoryInfo', JSON.stringify(location.state));
      }
    }, [location.state]);

  return (
      <>
        {subcategoriesWithCategoryName.map((subcategoryWithCategoryName, index) => (         
            <div key={index}>
                <Link to={`/category/${categoryId}`}>{subcategoryWithCategoryName.category_name}</Link>
                <span> ＞ </span>
                <Link
                    to={`/subcategory/${subcategoryWithCategoryName.id}`}
                    state={{ id: categoryId, name: categoryName }}
                >{subcategoryWithCategoryName.name}</Link>
            </div>
        ))}
        <div className={styles.question_box}>
            <h1>{question?.id}</h1>
                <div className={styles.questionHeader}>
                    <div className={styles.question_problem}>
                        問題：
                        <div>
                            {question?.problem && question.problem.includes('\\') ? (
                                <BlockMath math={question.problem} />
                            ) : (
                                <span>{question?.problem}</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.questionIsFlg}>
                        <div
                            className={`${styles.questionIsFlgValue} ${
                            question?.is_correct ? styles.correct : styles.incorrect
                            }`}
                            onClick={handleUpdateIsCorrect}
                        >
                        {question?.is_correct ? '正解' : '不正解'}
                        </div>
                    </div>
                </div>
            <div>
            <div className={styles.answerContainer}>
                <div
                    className={`${styles.answerToggle} ${
                        showAnswer ? styles.show : ''
                    }`}
                    onClick={() => setShowAnswer(!showAnswer)}
                >
                    {showAnswer ? '答えを隠す' : '答えを表示する'}
                </div>
                <div
                    className={`${styles.answerText} ${
                        showAnswer ? styles.show : ''
                    }`}
                >
                {
                question?.answer.map((answer, index) => (
                    <div key={index}>
                    {answer.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                        {isLatex(line) ? (
                            <BlockMath math={line} />
                        ) : (
                            <>
                            {line}
                            <br />
                            </>
                        )}
                        </React.Fragment>
                    ))}
                    </div>
                ))
                }
                </div>
            </div>
            </div>
            <button onClick={handleNavigateToPreviousSubcategoryPage}>Back to サブカテゴリ内のQuestion一覧</button>
            <div className={styles.questionActions}>
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
                    categoryId={categoryId}
                    defaultCategoryName={categoryName}
                    question={question}
                    setModalIsOpen={setChangeSubcategoryModalIsOpen}
                    setSubcategoriesRelatedToQuestion={setSubcategoriesWithCategoryName}
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