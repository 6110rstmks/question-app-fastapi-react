import { useEffect, useState } from 'react'
import { fetchSubcategory } from '../../../api/SubcategoryAPI'
import { fetchQuestionsBySubcategoryId } from '../../../api/QuestionAPI'
import { Question } from '../../../types/Question'
import { Category } from '../../../types/Category'

export const useSubcategoryPage = (
    subcategoryId: number,
    category: Category,
) => {
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);

    const [categoryI, setCategoryI] = useState(() => {
        
        const saved = localStorage.getItem('categoryInfo');
        return saved ? JSON.parse(saved) : {};
    })
    useEffect(() => {
        // CategoryBoxからSubcategoryPageに移動する際に、CategoryBoxがページの下の方の場合、
        // SubcategoryPageに移動した際にページの一番上にスクロールする。
        window.scrollTo(0, 0);

        (async () => {
            const data = await fetchQuestionsBySubcategoryId(subcategoryId);
            setQuestions(data);

            const data2 = await fetchSubcategory(subcategoryId);
            setSubcategoryName(data2.name)
        })();

        if (category) {
            localStorage.setItem('categoryInfo', JSON.stringify(category));
        }

    }, [subcategoryId]);
    return { subcategoryName, setSubcategoryName, questions, setQuestions, categoryI }
}

