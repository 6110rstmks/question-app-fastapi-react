import React, { useState } from "react"
import styles from './QuestionListPage.module.css'
import { QuestionWithCategoryId } from '../types/Question'
import { handleNavigateToQuestionPage } from "../utils/navigate_function"
import { useNavigate } from "react-router-dom"
import { fetchQuestionsBySearchProblemWord } from "../api/QuestionAPI"

const QuestionListPage = () => {

    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [questions , setQuestions] = useState<QuestionWithCategoryId[]>([])

    const navigate = useNavigate();
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProblemWord(e.target.value)
    }

    const handleSearchClick = async () => {
        if (searchProblemWord.trim() === "") return;
        const questions_data: QuestionWithCategoryId[] = await fetchQuestionsBySearchProblemWord(searchProblemWord)
        for (let i = 0; i < questions_data.length; i++) {
            const category_id = await fetchCategoryQuestionByQuestionId(questions_data[i].id)
            console.log(category_id)
            questions_data[i].category_id = category_id
        }
        console.log(questions_data)
        setQuestions(questions_data)
    }

    const fetchCategoryQuestionByQuestionId = async (question_id: number) => {
        const response = await fetch(`http://localhost:8000/category_question/question_id/${question_id}`)
        const data = await response.json()
        console.log(data)
        return data
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
                            onClick={() => handleNavigateToQuestionPage(navigate, question.id, question.category_id)}>
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