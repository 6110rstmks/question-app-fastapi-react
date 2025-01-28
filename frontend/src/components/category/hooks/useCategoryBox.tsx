import { useState, useEffect, useRef } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategoriesForHomePage } from "../../../api/SubcategoryAPI";

export const useCategoryBox = (
    categoryId: number,
    showForm: boolean,
    setShowForm: (showForm: boolean) => void,
    searchSubcategoryWord: string,
    searchQuestionWord: string
) => {
    const [subcategories, setSubcategories] = useState<SubcategoryWithQuestionCount[]>([]);
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const categoryBoxRef = useRef<HTMLDivElement | null>(null);

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategories((prev) => [...prev, subcategory]);
    };

    const handleAddSubcategory = async () => {
        if (!subcategoryName.trim()) {
            alert('サブカテゴリー名を入力してください');
            return
        }

        const response = await fetch('http://localhost:8000/subcategories/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: subcategoryName, category_id: categoryId }),
        });

        if (!response.ok) {
            throw new Error('Failed to create subcategory');
        }

        const data = await response.json() as SubcategoryWithQuestionCount;
        console.log(subcategories.length)

        if (subcategories.length < 6) {
            console.log(9879)
            addSubcategory(data);
        }
        setSubcategoryName("");
        setShowForm(false);
    }

    const adjustHeight = () => {
        if (categoryBoxRef.current) {
            if (showForm) {
                categoryBoxRef.current.style.height = "450px"; // フォームが表示されるときの高さ
            } else {
                categoryBoxRef.current.style.height = "400.5px"; // フォームが非表示のときの高さ
            }
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [showForm]);

    useEffect(() => {
        (async () => {
            const subcategories = await fetchSubcategoriesForHomePage(categoryId, searchSubcategoryWord, searchQuestionWord);
            setSubcategories(subcategories);
        })();
    }, [searchSubcategoryWord, searchQuestionWord]);

    return { subcategories, subcategoryName, setSubcategoryName, handleAddSubcategory, adjustHeight, categoryBoxRef };
};