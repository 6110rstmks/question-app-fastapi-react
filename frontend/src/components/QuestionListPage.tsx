import React, { useState } from "react"
import styles from './QuestionListPage.module.css'
import { QuestionWithCategoryIdAndCategoryNameAndSubcategoryId } from '../types/Question'
import { handleNavigateToQuestionPage } from "../utils/navigate_function"
import { useNavigate } from "react-router-dom"
import { fetchQuestionsBySearchProblemWord } from "../api/QuestionAPI"
import { fetchCategory } from "../api/CategoryAPI"
import { fetchSubcategoriesQuestionsByQuestionId } from "../api/SubcategoryQuestionAPI"

const QuestionListPage = () => {

    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [questions , setQuestions] = useState<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]>([])

    const navigate = useNavigate();
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProblemWord(e.target.value)
    }

    const handleSearchClick = async () => {
        if (searchProblemWord.trim() === "") return;
        const questions_data: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] = await fetchQuestionsBySearchProblemWord(searchProblemWord)
        for (let i = 0; i < questions_data.length; i++) {
            const category_id = await fetchCategoryQuestionByQuestionId(questions_data[i].id)
            const category = await fetchCategory(category_id)
            const subcategory_id = (await fetchSubcategoriesQuestionsByQuestionId(questions_data[i].id))[0].subcategory_id
            questions_data[i].category_name = category.name
            questions_data[i].categoryId = category_id
            questions_data[i].subcategoryId = subcategory_id
        }
        setQuestions(questions_data)
    }

    const fetchCategoryQuestionByQuestionId = async (question_id: number) => {
        const response = await fetch(`http://localhost:8000/categories_questions/question_id/${question_id}`)
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
                            onClick={() => handleNavigateToQuestionPage(
                                navigate,
                                question.id,
                                question.categoryId,
                                question.category_name,
                                question.subcategoryId)}>
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