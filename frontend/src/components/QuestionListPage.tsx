import React, { useEffect, useState } from "react"
import styles from './QuestionListPage.module.css'
import { Question } from '../types/Question'
import { Subcategory } from '../types/Subcategory'
import { handleNavigateToQuestionPage } from "../utils/navigate_function"
import { useNavigate } from "react-router-dom"

const QuestionListPage = () => {

    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [questions , setQuestions] = useState<Question[]>([])

    const navigate = useNavigate();
    

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
                <div >
                    {/* <div>
                        {subcategories.map((subcategory) => (         
                            <div>
                                <Link to={`/category/${subcategory.category_id}`}>{categoryName}</Link>
                                <span> ＞ </span>
                                <Link
                                    to={`/subcategory/${subcategory.id}`}
                                    state={{ id: category_id, name: categoryName }}
                                >{subcategory.name}</Link>
                            </div>
                        ))  }
                    </div> */}
                    {questions.map((question) => (
                        <div key={question.id} className={styles.question_box} onClick={() => handleNavigateToQuestionPage(navigate, question.id)}>
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