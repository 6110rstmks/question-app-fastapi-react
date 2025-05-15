import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Subcategory } from '../../../types/Subcategory';
import { CategoryWithQuestionCount } from '../../../types/Category'
import { fetchAllCategoriesWithQuestions } from '../../../api/CategoryAPI'
import { fetchSubcategoriesWithQuestionCountByCategoryId } from '../../../api/SubcategoryAPI'
import { fetchQuestionCount } from '../../../api/QuestionAPI'
import { fetchProblem } from '../../../api/ProblemAPI'

const useSetProblemPage = () => {
    // const [incorrectedOnlyFlgChecked, setIncorrectedOnlyFlgChecked] = useState<boolean>(true);
    const [solutionStatus, setSolutionStatus] = useState<string>('incorrect');
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const [selectedType, setSelectedType] = useState<string>('random')
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
    const [categories, setCategories] = useState<CategoryWithQuestionCount[]>([])
    const [problemCnt, setProblemCnt] = useState<number>(5)
    const [showAll, setShowAll] = useState<boolean>(false)
    const [questionCount, setQuestionCount] = useState<number | null>(null)

    const navigate = useNavigate();

    // カテゴリのチェックボックスにチェックを入れたら
    const handleCheckboxChange = async (categoryId: number) => {

        setShowAll(true)
        // カテゴリに紐づくサブカテゴリを取得する
        const subcategories = await fetchSubcategoriesWithQuestionCountByCategoryId(categoryId);
        setSubcategories(subcategories);

        setSelectedCategoryIds((prevSelected) => {
            // すでにカテゴリが選択されている場合は取り除き、選択されていない場合は追加する

            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    // ボタンをクリックしたら、問題群を生成して、問題出題画面に遷移する。その際レスポンスのデータを渡す。
    const handleSetProblem = async () => {
        if (selectedType === 'category' && selectedCategoryIds.length === 0) {
            alert('Please select at least one category');
            return;
        }

        const response = await fetchProblem(selectedType, ['incorrect'], problemCnt, selectedCategoryIds, [])
        const data = await response.json();
        navigate('/problem', { state: data });
    }

    useEffect(() => {
        (async () => {
            const response = await fetchAllCategoriesWithQuestions();
            setCategories(response);

            const questionCnt = await fetchQuestionCount()
            setQuestionCount(questionCnt)
        })()
    }, [])

    return {
        categories,
        questionCount,
        showAll,
        selectedType,
        setSelectedType,
        problemCnt,
        setProblemCnt,
        selectedCategoryIds,
        subcategories,
        setSolutionStatus,
        handleSetProblem,
        handleCheckboxChange
    }

}

export default useSetProblemPage