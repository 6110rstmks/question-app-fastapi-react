import { 
    useState, 
    useCallback, 
    useEffect 
} from 'react';
import { useNavigate } from "react-router"
import type { QuestionWithCategoryIdAndCategoryNameAndSubcategoryId } from '../../../types/Question';
import { fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord } from '../../../api/QuestionAPI'
import { fetchCategory } from '../../../api/CategoryAPI'
import { fetchSubcategoriesQuestionsByQuestionId } from '../../../api/SubcategoryQuestionAPI'
import { fetchCategoryQuestionByQuestionId } from '../../../api/CategoryQuestionAPI'

export const useQuestionListPage = () => {
    const [
        searchWord, 
        setSearchWord
    ] = useState<string>("")

    const [
        questions, 
        setQuestions
    ] = useState<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]>([])
    const navigate = useNavigate()

    // サイト内ショートカットキーの設定
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.key.toLowerCase() === 'k' &&
            event.metaKey // macOSでcommandキーまたはCapsLockキーを表す
        ) {            
            event.preventDefault()
            navigate('/')
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        };
    }, [handleKeyDown])

    const handleSearchQuestionClick = async () => {
        console.log(9898797)
        if (searchWord.trim() === "") return
        console.log(123456)
        const questions_data: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] =
        await fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord(
          searchWord
        )

        console.log("questions_data(before for)", JSON.stringify(questions_data, null, 2))
                
        for (let i = 0; i < questions_data.length; i++) {
            const category_id = (await fetchCategoryQuestionByQuestionId(questions_data[i].id)).category_id
            const category = await fetchCategory(category_id)
            const subcategory_id = (await fetchSubcategoriesQuestionsByQuestionId(questions_data[i].id))[0].subcategory_id
            questions_data[i].category_name = category.name
            questions_data[i].categoryId = category_id
            questions_data[i].subcategoryId = subcategory_id
        }

        console.log("questions_data after", questions_data)
        setQuestions(questions_data)
    }
    
    return {
        questions,
        setQuestions,
        searchWord,
        setSearchWord,
        handleSearchQuestionClick,
    }
}