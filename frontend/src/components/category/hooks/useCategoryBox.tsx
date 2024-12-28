import React, { useState, useCallback } from 'react';
import { Subcategory, SubcategoryWithQuestionCount } from "../../../types/Subcategory";

export const useCategoryBox = (categoryId: number) => {
    const [subcategories, setSubcategories] = useState<SubcategoryWithQuestionCount[]>([]);
    const [questionCounts, setQuestionCounts] = useState<{ [key: number]: number }>({});

    const fetchSubcategories = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8000/subcategories/category_id/${categoryId}/?limit=6`);
            if (response.ok) {
                const data: SubcategoryWithQuestionCount[] = await response.json();
                console.log(data)
                setSubcategories(data);
            } else {
                console.error("Failed to fetch subcategories");
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    }, [categoryId]);

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

    return { subcategories, questionCounts, fetchSubcategories, fetchQuestionCount, addSubcategory };
};