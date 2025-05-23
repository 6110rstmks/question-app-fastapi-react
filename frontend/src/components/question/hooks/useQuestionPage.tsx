import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { SubcategoryWithCategoryName } from '../../../types/Subcategory'
import { Question } from '../../../types/Question'
import { fetchSubcategoriesWithCategoryNameByQuestionId } from '../../../api/SubcategoryAPI'
import { deleteQuestion, incrementAnswerCount, fetchQuestion, updateQuestionIsCorrect } from '../../../api/QuestionAPI'
import { handleKeyDownForShowAnswer } from '../../../utils/function'
import { handleNavigateToSubcategoryPage } from '../../../utils/navigate_function'
import { Category } from '../../../types/Category'

export const useQuestionPage = (
    categoryId: number,
    subcategoryId: number,
    questionId: number,
    categoryName: string,
    subcategoryName: string,
) => {
    const [question, setQuestion] = useState<Question>()
    const [subcategoriesWithCategoryName, setSubcategoriesWithCategoryName] = useState<SubcategoryWithCategoryName[]>([])
    const [showAnswer, setShowAnswer] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleDeleteQuestion = async () => {
        let confirmation = prompt("削除を実行するには、「削除」と入力してください:")
        if (confirmation !== '削除') {
            return;
        }
        await deleteQuestion(questionId); // API コール

        const categoryForNavigation: Category = { id: categoryId, name: categoryName, userId: 1 };

        handleNavigateToSubcategoryPage(
            navigate,
            categoryForNavigation,
            subcategoryId,
        )
    }

    const handleAnswerQuestion = () => {
        incrementAnswerCount(question!.id) // API コール
        // 表示するquestion.answer_countの数も更新
        setQuestion((prev) => {
            if (prev) {
                return {
                    ...prev,
                    answer_count: prev.answer_count + 1,
                }
            }
            return prev
        })
        alert('回答数を更新しました')
    }

    const handleUpdateIsCorrect = async () => {
        await incrementAnswerCount(question!.id)
        await updateQuestionIsCorrect(question!) 
        const data = await fetchQuestion(question!.id)
        setQuestion(data)

    }

    // このQuestionPageに遷移した元のSubcategoryPageに戻る。
    // const handleNavigateToPreviousSubcategoryPage = () => {
    //     const category = { id: categoryId, name: categoryName };
    //     navigate(`/subcategory/${subcategoryId}`, {
    //         state: category
    //     });
    // }

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => handleKeyDownForShowAnswer(event, setShowAnswer);

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [handleKeyDownForShowAnswer]);

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
        handleUpdateIsCorrect,
    }
}