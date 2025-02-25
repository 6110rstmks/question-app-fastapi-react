import React, { useEffect, useState } from "react"
import styles from './QuestionListPage.module.css'
import { Question } from '../types/Question'


const QuestionListPage = () => {

    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [questions , setQuestions] = useState<Question[]>([])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProblemWord(e.target.value)
    }

    const fetchQuestions = async () => {
        if (searchProblemWord.trim() === "") return;
        const response = await fetch(`http://localhost:8000/questions/?searchProblemWord=${searchProblemWord}`)
        const questions: Question[] = await response.json()
        setQuestions(questions)
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
                <button onClick={fetchQuestions}>検索する</button>
            </div>
            <div>
                <div className={styles.question_box}>
                    {questions.map((question) => (
                        <div key={question.id}>
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