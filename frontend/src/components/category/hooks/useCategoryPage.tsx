import React, { useState, useCallback, useEffect } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategories } from "../../../api/SubcategoryAPI";
import { fetchCategory } from "../../../api/CategoryAPI";
import { Category } from "../../../types/Category";

export const useCategoryPage = (categoryId: number) => {
    const [subcategories, setSubcategories] = useState<SubcategoryWithQuestionCount[]>([]);
    const [category, setCategory] = useState<Category>();

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategories((prev) => [...prev, subcategory]);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        (async () => {
            const subcategories = await fetchSubcategories(categoryId);
            setSubcategories(subcategories);

            const category = await fetchCategory(categoryId);
            setCategory(category);
        })();
    }, []);

    return { category, subcategories, addSubcategory };
};