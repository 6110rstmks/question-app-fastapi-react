// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { Category } from "../types/Category";
import { fetchCategories, fetchPageCount } from "../api/CategoryAPI";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom"
import { fetchQuestionCount } from "../api/QuestionAPI"

export const useCategories = (page: number, limit: number, searchCategoryWord: string) => {
    const [categories, setCategories] = useState<Category[]>([])
    // アプリの初期状態はカテゴリがまだ作成されていないため、ページ数はnull
    const [pageCount, setPageCount] = useState<number | null>(null)
    const [questionCount, setQuestionCount] = useState<number | null>(null)
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
                console.log(count)
                setPageCount(count);
                
                const data = await fetchQuestionCount()
                setQuestionCount(data)
            } catch (error) {
                console.error(error);
            }
        };
        loadPageCount();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            const skip = (page - 1) * limit;
            const categories: Category[] = await fetchCategories(skip, limit, searchCategoryWord)
            setCategories(categories)

        };
        loadCategories();
    }, [page, limit, searchCategoryWord])

    return { categories, pageCount, questionCount }
};
