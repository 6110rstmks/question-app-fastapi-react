import { useState, useEffect } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategoriesForHomePage } from "../../../api/SubcategoryAPI";

export const useCategoryBox = (
    categoryId: number,
    setShowForm: (showForm: boolean) => void,
) => {
    const [subcategories, setSubcategories] = useState<SubcategoryWithQuestionCount[]>([]);
    const [subcategoryName, setSubcategoryName] = useState<string>('');

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategories((prev) => [...prev, subcategory]);
    };

    const handleAddSubcategory = async () => {
        if (!subcategoryName.trim()) return;

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
        addSubcategory(data);
        setSubcategoryName("");
        setShowForm(false);
    }

    useEffect(() => {
        (async () => {
            const subcategories = await fetchSubcategoriesForHomePage(categoryId);
            setSubcategories(subcategories);
        })();
    }, []);

    return { subcategories, subcategoryName, setSubcategoryName, handleAddSubcategory };
};