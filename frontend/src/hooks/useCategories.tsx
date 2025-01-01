// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { Category } from "../types/Category";
import { fetchCategories, fetchPageCount } from "../api/CategoryAPI";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom"
import { fetchQuestionCount } from "../api/QuestionAPI"

export const useCategories = (page: number, limit: number, searchCategoryWord: string) => {
    const [categories, setCategories] = useState<Category[]>([])

    // アプリの初期状態の場合はカテゴリがまだ作成されていないためpageCount,questionCountはnull
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
            const count = await fetchPageCount();
            setPageCount(count);
            
            const data = await fetchQuestionCount()
            setQuestionCount(data)

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
