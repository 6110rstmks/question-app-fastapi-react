import React, { useState, useCallback, useEffect } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategories } from "../../../api/SubcategoryAPI";

export const useCategoryBox = (categoryId: number) => {
    const [subcategories, setSubcategories] = useState<SubcategoryWithQuestionCount[]>([]);
    const [questionCounts, setQuestionCounts] = useState<{ [key: number]: number }>({});

    const fetchQuestionCount = async (subcategoryId: number) => {
        const response = await fetch(`http://localhost:8000/questions/count?subcategory_id=${subcategoryId}`);
        if (response.ok) {
            const { count } = await response.json();
            setQuestionCounts((prev) => ({ ...prev, [subcategoryId]: count }));
        } else {
            console.error('Failed to fetch question count for subcategory', subcategoryId);
        }
    };

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategories((prev) => [...prev, subcategory]);
    };

    useEffect(() => {
        const loadSubcategories = async () => {
            const subcategories = await fetchSubcategories(categoryId);
            console.log(subcategories);
            setSubcategories(subcategories);
        }
        loadSubcategories();
    }, []);   

    return { subcategories, questionCounts, fetchQuestionCount, addSubcategory };
};