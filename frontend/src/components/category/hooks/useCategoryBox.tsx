import React, { useState, useCallback, useEffect } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategoriesForHomePage } from "../../../api/SubcategoryAPI";

export const useCategoryBox = (categoryId: number) => {
    const [subcategories, setSubcategories] = useState<SubcategoryWithQuestionCount[]>([]);

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategories((prev) => [...prev, subcategory]);
    };

    useEffect(() => {
        (async () => {
            const subcategories = await fetchSubcategoriesForHomePage(categoryId);
            setSubcategories(subcategories);
        })();
    }, []);

    return { subcategories, addSubcategory };
};