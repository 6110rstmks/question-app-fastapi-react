import { SubcategoryWithQuestionCount } from "../types/Subcategory";
import { Question } from "../types/Question";
import { updateQuestionIsCorrect, fetchQuestion } from "../api/QuestionAPI";

export const addSubcategory = (
    setSubcategories: React.Dispatch<React.SetStateAction<SubcategoryWithQuestionCount[]>>,
    subcategory: SubcategoryWithQuestionCount
) => {
    setSubcategories((prev) => [...prev, subcategory]);
};

// export const handleKeyDown = useCallback((
//     event: KeyboardEvent,
//     setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//     if (event.ctrlKey && event.key.toLowerCase() === 'b') {
//         event.preventDefault();
//         setShowAnswer(prev => !prev);
//     }
// }, []);

export const handleKeyDown = (
    event: KeyboardEvent,
    setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setShowAnswer(prev => !prev);
    }
};

export const handleUpdateIsCorrect = async (
    question: Question,
    setQuestion: React.Dispatch<React.SetStateAction<Question | null>>
) => {
    await updateQuestionIsCorrect(question!); // API コール
    const data = await fetchQuestion(question!.id); // データをリフレッシュ
    setQuestion(data)
}