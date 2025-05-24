import { SubcategoryWithQuestionCount } from "../types/Subcategory";
import { Question } from "../types/Question";
import { updateQuestionIsCorrect, fetchQuestion } from "../api/QuestionAPI";

export const addSubcategory = (
    setSubcategories: React.Dispatch<React.SetStateAction<SubcategoryWithQuestionCount[]>>,
    subcategory: SubcategoryWithQuestionCount
) => {
    setSubcategories((prev) => [...prev, subcategory]);
};

export const handleKeyDownForShowAnswer = (
    event: KeyboardEvent,
    setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (event.key.toLowerCase() === 'b' || event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setShowAnswer(prev => !prev)
    }
};

export const handleUpdateIsCorrect = async (
    question: Question,
    setQuestion: React.Dispatch<React.SetStateAction<Question | null>>
) => {
    await updateQuestionIsCorrect(question!)
    const data = await fetchQuestion(question!.id)
    setQuestion(data)
}