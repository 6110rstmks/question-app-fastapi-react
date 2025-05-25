import { useState, useEffect, useRef } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategoriesForHomePage, createSubcategory } from "../../../api/SubcategoryAPI";

interface useCategoryBoxProps {
    categoryId: number,
    showForm: boolean,
    setShowForm: (showForm: boolean) => void,
    searchSubcategoryWord: string,
    searchQuestionWord: string,
    searchAnswerWord: string,
}

export const useCategoryBox = ({
    categoryId,
    showForm,
    setShowForm,
    searchSubcategoryWord,
    searchQuestionWord,
    searchAnswerWord
}: useCategoryBoxProps) => {

    const [
        subcategoriesWithQuestionCount,
        setSubcategoriesWithQuestionCount
    ] = useState<SubcategoryWithQuestionCount[]>([])

    const [
        inputSubcategoryName,
        setInputSubcategoryName
    ] = useState<string>('')

    const categoryBoxRef = useRef<HTMLDivElement | null>(null)

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategoriesWithQuestionCount((prev) => [...prev, subcategory])
    };

    const handleAddSubcategory = async () => {
        if (!inputSubcategoryName.trim()) {
            alert('サブカテゴリー名を入力してください')
            return
        }

        const response = await createSubcategory(inputSubcategoryName, categoryId)

        const data = await response.json() as SubcategoryWithQuestionCount

        if (subcategoriesWithQuestionCount.length < 6) {
            addSubcategory(data)
        }
        setInputSubcategoryName("")
        setShowForm(false)
    }

    // この関数は showForm（フォームが表示されているかどうか）に応じて、categoryBox の高さを変える処理

    const adjustHeight = () => {
        if (categoryBoxRef.current) {
            if (showForm) {
                categoryBoxRef.current.style.height = "450px" // フォームが表示されるときの高さ
            } else {
                categoryBoxRef.current.style.height = "400.5px" // フォームが非表示のときの高さ
            }
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [showForm]);

    useEffect(() => {

        (async () => {
            const subcategories = await fetchSubcategoriesForHomePage(categoryId, searchSubcategoryWord, searchQuestionWord, searchAnswerWord);
            setSubcategoriesWithQuestionCount(subcategories);
        })();
    }, [searchSubcategoryWord, searchQuestionWord, searchAnswerWord]);

    return { 
        subcategoriesWithQuestionCount, 
        inputSubcategoryName, 
        setInputSubcategoryName, 
        handleAddSubcategory,
        adjustHeight, 
        categoryBoxRef 
    };
};