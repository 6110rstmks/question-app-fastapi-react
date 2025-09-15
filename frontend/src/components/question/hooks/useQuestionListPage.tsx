import { 
    useState, 
    useCallback, 
    useEffect 
} from 'react';
import { useNavigate } from "react-router"
import type { Question, QuestionWithCategoryIdAndCategoryNameAndSubcategoryId } from '../../../types/Question';
import { fetchQuestionsByProblemWord } from '../../../api/QuestionAPI'
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
        // const questions_data: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] =
        // await fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord(
        //   searchWord
        // )

        const question_data2: Question[] = await fetchQuestionsByProblemWord(searchWord) 

        const question_data3: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] = await Promise.all(
            question_data2.map(async (q) => {
                const { category_id } = await fetchCategoryQuestionByQuestionId(q.id);
                const category = await fetchCategory(category_id);
                const subcategory = await fetchSubcategoriesQuestionsByQuestionId(q.id);

                return {
                    ...q,
                    category_name: category.name,
                    categoryId: category_id,
                    subcategoryId: subcategory[0].subcategory_id,
                };
            })
        );

        setQuestions(question_data3)
    }
    
    return {
        questions,
        setQuestions,
        searchWord,
        setSearchWord,
        handleSearchQuestionClick,
    }
}