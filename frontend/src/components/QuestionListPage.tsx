import React, { useState } from "react"
import styles from './QuestionListPage.module.css'
import { QuestionWithCategoryIdAndCategoryName } from '../types/Question'
import { handleNavigateToQuestionPage } from "../utils/navigate_function"
import { useNavigate } from "react-router-dom"
import { fetchQuestionsBySearchProblemWord } from "../api/QuestionAPI"
import { fetchCategory } from "../api/CategoryAPI"

const QuestionListPage = () => {

    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [questions , setQuestions] = useState<QuestionWithCategoryIdAndCategoryName[]>([])

    const navigate = useNavigate();
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProblemWord(e.target.value)
    }

    const handleSearchClick = async () => {
        if (searchProblemWord.trim() === "") return;
        const questions_data: QuestionWithCategoryIdAndCategoryName[] = await fetchQuestionsBySearchProblemWord(searchProblemWord)
        for (let i = 0; i < questions_data.length; i++) {
            const category_id = await fetchCategoryQuestionByQuestionId(questions_data[i].id)
            const category = await fetchCategory(category_id)
            questions_data[i].category_name = category.name
            questions_data[i].category_id = category_id
        }
        setQuestions(questions_data)
    }

    const fetchCategoryQuestionByQuestionId = async (question_id: number) => {
        const response = await fetch(`http://localhost:8000/category_question/question_id/${question_id}`)
        const data = await response.json()
        return data.category_id
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
                            onClick={() => handleNavigateToQuestionPage(navigate, question.id, question.category_id, question.category_name)}>
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