import styles from './QuestionListPage.module.css'
import { handleNavigateToQuestionPage } from "../utils/navigate_function"
import { useNavigate } from "react-router-dom"
import { useQuestionListPage } from "../components/useQuestionListPage"

const QuestionListPage = () => {

    const navigate = useNavigate();

    const { 
        questions,
        handleSearch,
        handleSearchClick
    } = useQuestionListPage()

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