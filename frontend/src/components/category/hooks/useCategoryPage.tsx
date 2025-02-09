import React, { useState, useCallback, useEffect } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategoriesByCategoryId } from "../../../api/SubcategoryAPI";
import { fetchCategory } from "../../../api/CategoryAPI";
import { Category } from "../../../types/Category";

export const useCategoryPage = (categoryId: number) => {
    const [subcategories, setSubcategories] = useState<SubcategoryWithQuestionCount[]>([]);
    const [category, setCategory] = useState<Category>();
    const [subcategoryName, setSubcategoryName] = useState<string>("");
    const [searchWord, setSearchWord] = useState<string>("");

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
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        (async () => {
            // const subcategories = await fetchSubcategoriesByCategoryId(categoryId, searchWord);
            // setSubcategories(subcategories);

            const category = await fetchCategory(categoryId);
            setCategory(category);
        })();
    }, [searchWord]);

    useEffect(() => {
        (async () => {
            const subcategories = await fetchSubcategoriesByCategoryId(categoryId, searchWord);
            setSubcategories(subcategories);
        })();
    }, [searchWord]);

    return { category, subcategories, subcategoryName, setSubcategoryName ,handleAddSubcategory, searchWord, handleSearch };
};