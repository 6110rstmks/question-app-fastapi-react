import React, { useState, useEffect } from 'react'
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory"
import { fetchSubcategoriesWithQuestionCountByCategoryId, createSubcategory } from "../../../api/SubcategoryAPI"
import { fetchCategory } from "../../../api/CategoryAPI"
import { Category } from "../../../types/Category"
import { fetchProblem } from '../../../api/ProblemAPI'
import { useNavigate } from "react-router"
import { 
    fetchUncorrectedQuestionCountByCategoryId,
    fetchCorrectedQuestionCountByCategoryIdOrderThanOneMonth,
    fetchQuestionCountByCategoryId,
    fetchTemporaryQuestionCountByCategoryIdOrderThanXDays
} from '../../../api/QuestionCountAPI'


export const useCategoryPage = (categoryId: number) => {
    const [
        subcategories, 
        setSubcategories
    ] = useState<SubcategoryWithQuestionCount[]>([])

    const [category, setCategory] = useState<Category>()

    const [
        subcategoryName,
        setSubcategoryName
    ] = useState<string>("")

    const [searchWord, setSearchWord] = useState<string>("")

    const [
        questionCount,
        setQuestionCount
    ] = useState<number | null>(null)

    const [
        uncorrectedQuestionCount,
        setUncorrectedQuestionCount
    ] = useState<number | null>(null)

    const [
        temporaryQuestionCountFifteenDaysAgo,
        setTemporaryQuestionCountFifteenDaysAgo
    ] = useState<number | null>(null)

    const [
        correctedQuestionCountOrderThanOneMonth,
        setCorrectedQuestionCountOrderThanOneMonth
    ] = useState<number | null>(null)

    const navigate = useNavigate()

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value)
    }

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategories((prev) => [...prev, subcategory]);
    }

    const handleSetUnsolvedProblem = async () => {
        const response = await fetchProblem('category', 'incorrect', 4, [categoryId], [])
        if (!response.ok) {
            alert('出題する問題がありません。');
            return
        }
        const problemData = await response.json()
        navigate('/problem', { 
            state: {
                problemData, 
                from: 'categoryPage',
                backToId: categoryId
            }
        })
    }

    const handleSetTemporaryProblem = async () => {
        const response = await fetchProblem('category', 'temporary', 4, [categoryId], [])
        if (!response.ok) {
            const data = await response.json()
            alert(data.detail)
        } else {
            const problemData = await response.json()
            navigate('/problem', { 
                state: {
                    problemData, 
                    from: 'categoryPage',
                    backToId: categoryId
                }
            })
        }
    }

    const handleSetSolvedProblem = async () => {
        const response = await fetchProblem('category', 'correct', 4, [categoryId], [])
        if (!response.ok) {
            alert('出題する問題がありません。');
            return
        }
        const problemData = await response.json()
        navigate('/problem', { 
            state: {
                problemData, 
                from: 'categoryPage',
                backToId: categoryId
            }
        })
    }

    const handleAddSubcategory = async () => {
        if (!subcategoryName.trim()) {
            alert('サブカテゴリー名を入力してください');
            return
        }
        const response = await createSubcategory(subcategoryName, categoryId);
        if (!response.ok) {
            const data = await response.json()
            alert(data.detail)
            return
        }
        const data = await response.json() as SubcategoryWithQuestionCount
        addSubcategory(data)
        setSubcategoryName("")
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        (async () => {
            const category = await fetchCategory(categoryId);
            setCategory(category);

            const questionCount = await fetchQuestionCountByCategoryId(categoryId)
            setQuestionCount(questionCount)

            const uncorrectedQuestionCount = await fetchUncorrectedQuestionCountByCategoryId(categoryId)
            setUncorrectedQuestionCount(uncorrectedQuestionCount)

            const temporaryQuestionCount = await fetchTemporaryQuestionCountByCategoryIdOrderThanXDays(categoryId, 15)
            console.log(temporaryQuestionCount)
            setTemporaryQuestionCountFifteenDaysAgo(temporaryQuestionCount)

            const correctedQuestionCount = await fetchCorrectedQuestionCountByCategoryIdOrderThanOneMonth(categoryId)
            setCorrectedQuestionCountOrderThanOneMonth(correctedQuestionCount)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const subcategories: SubcategoryWithQuestionCount[] = await fetchSubcategoriesWithQuestionCountByCategoryId(categoryId, searchWord);
            setSubcategories(subcategories)
        })();
    }, [searchWord])

    return { 
        category,
        subcategories,
        subcategoryName,
        uncorrectedQuestionCount,
        temporaryQuestionCountFifteenDaysAgo,
        correctedQuestionCountOrderThanOneMonth,
        questionCount,
        setSubcategoryName,
        handleAddSubcategory,
        searchWord,
        handleSearch,
        handleSetUnsolvedProblem,
        handleSetTemporaryProblem,
        handleSetSolvedProblem
    };
};