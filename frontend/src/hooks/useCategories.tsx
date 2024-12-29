// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { Category } from "../types/Category";
import { fetchCategories, fetchPageCount } from "../api/CategoryAPI";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom"

export const useCategories = (page: number, limit: number, searchCategoryWord: string) => {
    const [categories, setCategories] = useState<Category[]>([])
    // アプリの初期状態はカテゴリがまだ作成されていないため、ページ数はnull
    const [pageCount, setPageCount] = useState<number | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // 未ログイン時にリダイレクト
        if (!isAuthenticated()) {
            navigate('/login')
            return;
        }
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
                const categories: Category[] = await fetchCategories(skip, limit, searchCategoryWord)
                setCategories(categories)
            } catch (error) {
                console.error(error)
            }
        };
        loadCategories();
    }, [page, limit, searchCategoryWord])

    return { categories, pageCount }
};
