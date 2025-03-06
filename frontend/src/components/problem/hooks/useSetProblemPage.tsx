import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subcategory } from '../../../types/Subcategory';
import { CategoryWithQuestionCount } from '../../../types/Category'
import { fetchAllCategoriesWithQuestions } from '../../../api/CategoryAPI'
import { fetchSubcategoriesByCategoryId } from '../../../api/SubcategoryAPI'
import { setProblem } from '../../../api/ProblemAPI'

export const useSetProblemPage = () => {
    const [incorrectedOnlyFlgChecked, setIncorrectedOnlyFlgChecked] = useState<boolean>(false);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const [selectedType, setSelectedType] = useState<string>('random')
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
    const [categories, setCategories] = useState<CategoryWithQuestionCount[]>([])
    const [problemCnt, setProblemCnt] = useState<number>(5)
    const [showAll, setShowAll] = useState<boolean>(false)
    const navigate = useNavigate();

    // カテゴリのチェックボックスにチェックを入れたら
    const handleCheckboxChange = async (categoryId: number) => {

        setShowAll(true)

        // カテゴリに紐づくサブカテゴリを取得する
        const subcategories = await fetchSubcategoriesByCategoryId(categoryId);
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

        const response = await setProblem(selectedType, incorrectedOnlyFlgChecked, problemCnt, selectedCategoryIds)

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create problems');
        }
        const problemData = await response.json();
        navigate('/problem', { state: problemData });
    }
    
    useEffect(() => {
        (async () => {
            const response = await fetchAllCategoriesWithQuestions();
            setCategories(response);
        })()
    }, [])

    return {
        categories,
        showAll,
        selectedType,
        setSelectedType,
        problemCnt,
        setProblemCnt,
        selectedCategoryIds,
        subcategories,
        incorrectedOnlyFlgChecked,
        setIncorrectedOnlyFlgChecked,
        handleSetProblem,
        handleCheckboxChange
    }

}