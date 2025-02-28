import React, { useState } from "react"
import styles from './QuestionListPage.module.css'
import { Question } from '../types/Question'
import { handleNavigateToQuestionPage } from "../utils/navigate_function"
import { useNavigate } from "react-router-dom"
import { fetchQuestionsBySearchProblemWord } from "../api/QuestionAPI"

const QuestionListPage = () => {

    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [questions , setQuestions] = useState<Question[]>([])

    const navigate = useNavigate();
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProblemWord(e.target.value)
    }

    const handleSearchClick = async () => {
        if (searchProblemWord.trim() === "") return;
        const data: Question[] = await fetchQuestionsBySearchProblemWord(searchProblemWord)
        setQuestions(data)
    }

    return (
        <div>
            <div className={styles.search_section}>
                <div className={styles.search_container}>
                    <input
                    type="text"
                    className={styles.search_box}
                    onChange={handleSearch}
                    />
                </div>
                <button onClick={() => handleSearchClick()}>検索する</button>
            </div>
            <div>
                <div>
                    {questions.map((question) => (
                        <div key={question.id} 
                            className={styles.question_box} 
                            onClick={() => handleNavigateToQuestionPage(navigate, question.id)}>
                            <div>
                                <div>問題：</div>{question.problem}
                            </div>
                            <div>
                                <div>解答：</div>{question.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>


    );
}

export default QuestionListPage