import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { SubcategoryWithCategoryName } from '../../../types/Subcategory'
import { Question } from '../../../types/Question'
import { fetchSubcategoriesWithCategoryNameByQuestionId } from '../../../api/SubcategoryAPI'
import { 
    deleteQuestion,
    incrementAnswerCount, 
    fetchQuestion, 
    updateLastAnsweredDate
} from '../../../api/QuestionAPI'
import { 
    handleKeyDownForShowAnswer 
} from '../../../utils/function'
import { handleNavigateToSubcategoryPage } from '../../../utils/navigate_function'
import { Category } from '../../../types/Category'

export const useQuestionPage = (
    categoryId: number,
    subcategoryId: number,
    questionId: number,
    categoryName: string,
    subcategoryName: string,
    changeSubcategoryModalIsOpen: boolean,
    editModalIsOpen: boolean,
) => {
    const [question, setQuestion] = useState<Question | undefined>()

    const [
        subcategoriesWithCategoryName, 
        setSubcategoriesWithCategoryName
    ] = useState<SubcategoryWithCategoryName[]>([])
    
    const [showAnswer, setShowAnswer] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleDeleteQuestion = async () => {
        let confirmation = prompt("削除を実行するには、「削除」と入力してください:")
        if (confirmation !== '削除') {
            return;
        }
        await deleteQuestion(questionId)

        const categoryForNavigation: Category = { id: categoryId, name: categoryName, userId: 1 }

        handleNavigateToSubcategoryPage(
            navigate,
            categoryForNavigation,
            subcategoryId,
        )
    }

    const handleAnswerQuestion = () => {
        incrementAnswerCount(question!.id) 

        // 回答の最終更新日時を更新
        updateLastAnsweredDate(question!.id)

        // 表示するquestion.answer_count,question.last_answered_dateの数も更新
        setQuestion((prev) => {
            if (prev) {
                return {
                    ...prev,
                    answer_count: prev.answer_count + 1,
                    last_answered_date: new Date().toISOString().slice(0, 10) // YYYY-MM-DD形式で更新
                }
            }
            return prev
        })
    }

    // const handleUpdateIsCorrect = async () => {
    //     await incrementAnswerCount(question!.id)
    //     await updateQuestionIsCorrect(question!) 
    //     await updateLastAnsweredDate(question!.id)

    //     const data = await fetchQuestion(question!.id)
    //     setQuestion(data)
    // }

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => handleKeyDownForShowAnswer(event, setShowAnswer)

        if (!changeSubcategoryModalIsOpen && !editModalIsOpen) {
            window.addEventListener('keydown', onKeyDown)
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [handleKeyDownForShowAnswer, changeSubcategoryModalIsOpen, editModalIsOpen]);

    useEffect(() => {
        // 質問データを取得して設定
        (async () => {
            const data: Question = await fetchQuestion(questionId)
            setQuestion(data)

            // 所属するサブカテゴリを変更する際に使用する。
            const data2: SubcategoryWithCategoryName[] = await fetchSubcategoriesWithCategoryNameByQuestionId(questionId);
            setSubcategoriesWithCategoryName(data2)
        })()

    }, [questionId])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return { 
        subcategoriesWithCategoryName,
        setSubcategoriesWithCategoryName,
        question,
        setQuestion,
        showAnswer,
        setShowAnswer,
        handleDeleteQuestion,
        handleAnswerQuestion,
    }
}