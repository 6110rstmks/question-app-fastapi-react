import type { SubcategoryWithQuestionCount } from "../types/Subcategory"
import type { Question } from "../types/Question"
import { 
    updateQuestionIsCorrect, 
    fetchQuestion, 
    incrementAnswerCount,
    updateLastAnsweredDate
} from "../api/QuestionAPI"

export const addSubcategory = (
    setSubcategories: React.Dispatch<React.SetStateAction<SubcategoryWithQuestionCount[]>>,
    subcategory: SubcategoryWithQuestionCount
) => {
    setSubcategories((prev) => [...prev, subcategory]);
}

export const handleKeyDownForShowAnswer = (
    event: KeyboardEvent,
    setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (event.key.toLowerCase() === 'b' || event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setShowAnswer(prev => !prev)
    }
}

// ジェネリクスにした理由はquestionPageではundefinedをとるが、
// questionEditModalではundefinedをとらない形式でエラーがでるため
export const handleUpdateIsCorrect = async<T extends Question | undefined> (
    // question: Question | undefined,
    question: T,
    // setQuestion: React.Dispatch<React.SetStateAction<Question | undefined>>
    setQuestion: React.Dispatch<React.SetStateAction<T>>
) => {
    await updateQuestionIsCorrect(question!)
    await incrementAnswerCount(question!.id)
    await updateLastAnsweredDate(question!.id)
    const data = await fetchQuestion(question!.id)
    setQuestion(data as T)
}

export const isLatex = (text: string) => text.includes('\\')
