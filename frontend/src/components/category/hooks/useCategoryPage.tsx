import React, { useState, useEffect } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategoriesWithQuestionCountByCategoryId, createSubcategory } from "../../../api/SubcategoryAPI";
import { fetchCategory } from "../../../api/CategoryAPI";
import { Category } from "../../../types/Category";

export const useCategoryPage = (categoryId: number) => {
    const [subcategories, setSubcategories] = useState<SubcategoryWithQuestionCount[]>([]);
    const [category, setCategory] = useState<Category>();
    const [subcategoryName, setSubcategoryName] = useState<string>("");
    const [searchWord, setSearchWord] = useState<string>("");
    const [errMessage, setErrorMessage] = useState<string>("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategories((prev) => [...prev, subcategory]);
    };

    const handleAddSubcategory = async () => {
        if (!subcategoryName.trim()) {
            alert('サブカテゴリー名を入力してください');
            return
        }

        const response = await createSubcategory(subcategoryName, categoryId);

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.detail);
            return
        }
        const data = await response.json() as SubcategoryWithQuestionCount
        addSubcategory(data)
        setSubcategoryName("")
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        (async () => {
            const category = await fetchCategory(categoryId);
            setCategory(category);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const subcategories: SubcategoryWithQuestionCount[] = await fetchSubcategoriesWithQuestionCountByCategoryId(categoryId, searchWord);
            setSubcategories(subcategories)
        })();
    }, [searchWord]);

    return { 
        category,
        subcategories,
        subcategoryName,
        setSubcategoryName,
        handleAddSubcategory,
        searchWord,
        handleSearch
    };
};