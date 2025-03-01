import { SubcategoryWithQuestionCount } from "../types/Subcategory";

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