import { useEffect, useState } from 'react'
import { fetchSubcategory } from '../../../api/SubcategoryAPI'
import { useLocation } from 'react-router-dom';
import { fetchQuestionsBySubcategoryId } from '../../../api/QuestionAPI'
import { Question } from '../../../types/Question'
import { Category } from '../../../types/Category'

export const useSubcategoryPage = (
    subcategoryId: number,
    category: Category,
) => {
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const location = useLocation()
    

    const [categoryInfo, setCategoryInfo] = useState(() => {
        const saved = localStorage.getItem('categoryInfo');
        console.log(saved)
        return saved ? JSON.parse(saved) : {};
    })

    useEffect(() => {
        if (location.state) {
            setCategoryInfo(location.state);
            localStorage.setItem('categoryInfo', JSON.stringify(location.state));
        }
    }, [location.state]);
    
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
    return { subcategoryName, setSubcategoryName, questions, setQuestions, categoryInfo }
}

