import { useEffect, useState } from 'react'
import { fetchSubcategory } from '../../../api/SubcategoryAPI'
import { useLocation, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    

    const [categoryInfo, setCategoryInfo] = useState(() => {
        const saved = localStorage.getItem('categoryInfo');
        return saved ? JSON.parse(saved) : {};
    })

    const handleNavigateToQuestionPage = (question_id: number) => {
        navigate(`/question/${question_id}`, { 
            state: {
                category_id: categoryInfo.id,
                subcategory_id: subcategoryId,
                categoryName: categoryInfo.name,
                subcategoryName: subcategoryName,
            } 
        });
    }

    // const handleNavigateToCategoryPage = () => {
    //     handleNavigateToCategoryPage(navigate, category)
    // }

    //「削除」と入力してクリックすることで削除が実行される。
    const handleDeleteSubcategory = async () => {

        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");

        if (confirmation !== '削除') {
            return;
        }

        const response = await fetch(`http://localhost:8000/subcategories/${subcategoryId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            prompt('Failed to delete subcategory');
        }
        navigate('/');
    }

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
    return { subcategoryName, setSubcategoryName, questions, setQuestions, categoryInfo, handleNavigateToQuestionPage, handleDeleteSubcategory };
}

