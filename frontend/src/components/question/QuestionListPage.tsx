import React from 'react'
import styles from './QuestionListPage.module.css'
import { handleNavigateToQuestionPage } from "../../utils/navigate_function"
import { useNavigate } from "react-router-dom"
import { useQuestionListPage } from "./hooks/useQuestionListPage"

const QuestionListPage = () => {
    const navigate = useNavigate();
    const { 
        questions,
        handleProblemSearch,
        handleAnswerSearch,
        handleProblemSearchClick,
        handleAnswerSearchClick
    } = useQuestionListPage()

    return (
        <div>
            <div className={styles.searchSection}>
                <div className={styles.searchProblemContainer}>
                    <label htmlFor="">問題文：</label>
                    <input
                        type="text"
                        className={styles.search_box}
                        onChange={handleProblemSearch}
                    />
                    <button onClick={() => handleProblemSearchClick()}>検索する</button>
                </div>
                <div className={styles.search_answer_container}>
                    <label htmlFor="">解答の文字列で検索：</label>
                    <input
                        type="text"
                        className={styles.search_box}
                        onChange={handleAnswerSearch}
                    />
                    <button onClick={() => handleAnswerSearchClick()}>検索する</button>
                </div>
            </div>
            <div>
            <div>カテゴリを絞っての問題文の検索を行えるようにしたい</div>
                <div>
                    {questions.map((question) => (
                        <div key={question.id} 
                            className={`
                                ${styles.question_box}
                                ${question.is_correct ? styles.correct : styles.incorrect}
                            `} 
                            onClick={() => handleNavigateToQuestionPage(
                                navigate,
                                question.id,
                                question.categoryId,
                                question.category_name,
                                question.subcategoryId)}>
                            <div>
                                <div>問題：</div>
                                {question.problem}
                            </div>
                            <div>
                                <div>解答：</div>
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
                    ))}
                </div>
            </div>
        </div>


    );
}

export default QuestionListPage