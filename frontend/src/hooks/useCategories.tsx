import { useEffect, useState, useCallback } from "react"
import type { Category } from "../types/Category"
import { fetchCategories, fetchPageCount } from "../api/CategoryAPI"
import { useNavigate } from "react-router"
import { 
    fetchQuestionCount, 
    fetchUncorrectedQuestionCount,
    fetchCorrectedQuestionCount,
    fetchTemporaryQuestionCount
} from "../api/QuestionCountAPI"

export const useCategories = (
    page: number,
    searchCategoryWord: string,
    searchSubcategoryWord: string,
    searchQuestionWord: string,
    searchAnswerWord: string
) => {
    const [categories, setCategories] = useState<Category[]>([])

    const limit =3

    // アプリの初期状態の場合はカテゴリがまだ作成されていないためpageCount,questionCountはnull
    const [
        pageCount, 
        setPageCount
    ] = useState<number | null>(null)

    const [
        questionCount, 
        setQuestionCount
    ] = useState<number | null>(null)

    const [
        uncorrectedQuestionCount, 
        setUncorrectedQuestionCount
    ] = useState<number | null>(null)

    const [
        correctedQuestionCount,
        setCorrectedQuestionCount
    ] = useState<number | null>(null)

    const [
        temporaryQuestionCount,
        setTemporaryQuestionCount
    ] = useState<number | null>(null)
    
    const navigate = useNavigate()

    const handleNavigateToQuestionListPage = () => {
        navigate('/question_list')
    }

    // サイト内ショートカットキーの設定
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.key.toLowerCase() === 'k' &&
            event.metaKey // macOSでcommandキーまたはCapsLockキーを表す
        ) {            
            event.preventDefault()
            handleNavigateToQuestionListPage()
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        };
    }, [handleKeyDown])

    useEffect(() => {

        const loadPageCount = async () => {
            const count = await fetchPageCount();
            setPageCount(count)

            const questionCount = await fetchQuestionCount()
            setQuestionCount(questionCount)
            const uncorrectedQuestionCount = await fetchUncorrectedQuestionCount()
            setUncorrectedQuestionCount(uncorrectedQuestionCount)
            const correctedQuestionCount = await fetchCorrectedQuestionCount()
            setCorrectedQuestionCount(correctedQuestionCount)

            const tempQuestionCnt = await fetchTemporaryQuestionCount()
            setTemporaryQuestionCount(tempQuestionCnt)

 
        };
        loadPageCount();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            const skip = (page - 1) * limit;
            const categories: Category[] = await fetchCategories({
                skip,
                limit,
                searchCategoryWord,
                searchSubcategoryWord,
                searchQuestionWord,
                searchAnswerWord
            });
            setCategories(categories)

        };
        loadCategories();
    }, [
        page,
        limit,
        searchCategoryWord, 
        searchSubcategoryWord, 
        searchQuestionWord, 
        searchAnswerWord
    ]);

    return { 
        categories, 
        pageCount, 
        questionCount, 
        uncorrectedQuestionCount,
        correctedQuestionCount,
        temporaryQuestionCount,
    }
};
