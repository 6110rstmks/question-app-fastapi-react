import React from 'react'
import styles from './QuestionListPage.module.css'
import { handleNavigateToQuestionPage } from "../../utils/navigate_function"
import { useNavigate } from "react-router"
import { useQuestionListPage } from "./hooks/useQuestionListPage"
import { SolutionStatus } from '../../types/SolutionStatus'

const QuestionListPage = () => {
    const navigate = useNavigate();
    const { 
        questions,
        searchAnswerWord,
        setSearchProblemWord,
        setSearchAnswerWord,
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
                        onChange={(e) => setSearchProblemWord(e.target.value)}
                        autoFocus={true}
                    />
                    <button onClick={() => handleProblemSearchClick()}>検索する</button>
                </div>
                <div className={styles.searchAnswerContainer}>
                    <label htmlFor="">解答の文字列で検索：</label>
                    <input
                        type="text"
                        className={styles.searchBox}
                        onChange={(e ) => setSearchAnswerWord(e.target.value)}
                        value={searchAnswerWord}
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
                                ${styles.questionBox} ${
                                question?.is_correct === SolutionStatus.Correct ? styles.correct : 
                                question?.is_correct === SolutionStatus.Temporary ? styles.temporary : 
                                styles.incorrect
                            }`} 
                            onClick={() => handleNavigateToQuestionPage(
                                navigate,
                                question.id,
                                question.categoryId,
                                question.category_name,
                                question.subcategoryId)}>
                            <div>
                                <div>Problem：</div>
                                {question.problem}
                            </div>
                            <div>
                                <div>Answer：</div>
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