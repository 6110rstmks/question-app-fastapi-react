// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { fetchCategories, fetchPageCount } from "../api/categoryApi";
import { Category } from "../types/Category";

export const useCategories = (page: number, limit: number, searchWord: string) => {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [pageCount, setPageCount] = useState<number | null>(null);

    useEffect(() => {
        const loadPageCount = async () => {
            try {
                const count = await fetchPageCount();
                setPageCount(count);
            } catch (error) {
                console.error(error);
            }
        };
        loadPageCount();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            const skip = (page - 1) * limit;
            try {
                const categories = await fetchCategories(skip, limit, searchWord);
                setCategoryList(categories);
            } catch (error) {
                console.error(error);
            }
        };
        loadCategories();
    }, [page, limit, searchWord]);

    return { categoryList, pageCount };
};
