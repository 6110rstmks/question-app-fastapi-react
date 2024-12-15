import React, { useState, useCallback } from 'react';
import { Subcategory } from "../../../types/Subcategory";


export const useCategoryBox = (categoryId: number) => {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    const fetchSubcategories = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8000/subcategories/category_id/${categoryId}/?limit=6`);
            if (response.ok) {
                const data: Subcategory[] = await response.json();
                setSubcategories(data);
            } else {
                console.error("Failed to fetch subcategories");
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    }, [categoryId]);

    const addSubcategory = (subcategory: Subcategory) => {
        setSubcategories((prev) => [...prev, subcategory]);
    };

    return { subcategories, fetchSubcategories, addSubcategory };
};