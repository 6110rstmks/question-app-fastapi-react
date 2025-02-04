// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { Category } from "../types/Category";
import { fetchCategories, fetchPageCount } from "../api/CategoryAPI";
import { isAuthenticated } from "../utils/auth_function";
import { useNavigate } from "react-router-dom"
import { fetchQuestionCount, fetchUncorrectedQuestionCount } from "../api/QuestionAPI"

export const useCategories = (
    page: number,
    limit: number,
    searchCategoryWord: string,
    searchSubcategoryWord: string,
    searchQuestionWord: string,
    searchAnswerWord: string
) => {
    const [categories, setCategories] = useState<Category[]>([])

    // アプリの初期状態の場合はカテゴリがまだ作成されていないためpageCount,questionCountはnull
    const [pageCount, setPageCount] = useState<number | null>(null)
    const [questionCount, setQuestionCount] = useState<number | null>(null)
    const [uncorrectedquestionCount, setUncorrectedquestionCount] = useState<number | null>(null)
    
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
            
            const questionCnt = await fetchQuestionCount()
            setQuestionCount(questionCnt)

            const uncorrectedQuestionCnt = await fetchUncorrectedQuestionCount()
            setUncorrectedquestionCount(uncorrectedQuestionCnt)

        };
        loadPageCount();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            const skip = (page - 1) * limit;
            const categories: Category[] = await fetchCategories(
                                                    skip,
                                                    limit,
                                                    searchCategoryWord,
                                                    searchSubcategoryWord,
                                                    searchQuestionWord,
                                                    searchAnswerWord
                                                )
            setCategories(categories)

        };
        loadCategories();
    }, [page, limit, searchCategoryWord, searchSubcategoryWord, searchQuestionWord, searchAnswerWord]);

    return { categories, pageCount, questionCount, uncorrectedquestionCount }
};
