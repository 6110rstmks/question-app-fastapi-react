import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router"


import type { Category } from "../../../types/Category"
import type { Subcategory2, SubcategoryWithQuestionCount } from "../../../types/Subcategory"
import type { Question } from '../../../types/Question'


import { fetchCategory } from "../../../api/CategoryAPI"
import { createSubcategory, fetchSubcategoriesByCategoryId } from "../../../api/SubcategoryAPI"
import { 
    fetchUncorrectedQuestionCountByCategoryId,
    fetchCorrectedQuestionCountByCategoryIdOrderThanOneMonth,
    fetchQuestionCountByCategoryId,
    fetchTemporaryQuestionCountByCategoryIdOrderThanXDays
} from '../../../api/QuestionCountAPI'
import { fetchProblem } from '../../../api/ProblemAPI'


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
        setSubcategories((prev) => [...prev, subcategory])
    }

    const handleSetUnsolvedProblem = async () => {
        const problemData = await fetchProblem('category', 'incorrect', 4, [categoryId], [])
        if (problemData.length === 0) {
            alert('出題する問題がありません。')
            return
        }

        navigate('/problem', { 
            state: {
                problemData, 
                from: 'categoryPage',
                backToId: categoryId
            }
        })
    }

    const handleSetTemporaryProblem = async () => {
        const problemData: Question[] = await fetchProblem('category', 'temporary', 4, [categoryId], [])
        if (problemData.length === 0) {
            alert('出題する問題がありません。')
            return
        }
        navigate('/problem', { 
            state: {
                problemData, 
                from: 'categoryPage',
                backToId: categoryId
            }
        })
    }

    const handleSetSolvedProblem = async () => {
        const problemData: Question[] = await fetchProblem('category', 'correct', 4, [categoryId], [])
        if (problemData.length === 0) {
            alert('出題する問題がありません。')
            return
        }
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
            alert('サブカテゴリー名を入力してください')
            return
        }
        const response = await createSubcategory(subcategoryName, categoryId)
        if (!response.ok) {
            const data = await response.json()
            alert(data.detail)
            return
        }
        const data = await response.json() as SubcategoryWithQuestionCount
        console.log(data)
        console.log('doudou')
        addSubcategory(data)
        setSubcategoryName("")
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        (async () => {
            const category = await fetchCategory(categoryId)
            setCategory(category)

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
            // const subcategories: SubcategoryWithQuestionCount[] = await fetchSubcategoriesWithQuestionCountByCategoryId(categoryId, searchWord)
            const subcategories: Subcategory2[] = await fetchSubcategoriesByCategoryId(categoryId)

            const subcategoriesWithCount: SubcategoryWithQuestionCount[] = await Promise.all(
                subcategories.map(async (subcategory) => {
                    const questionCount = await fetchQuestionCountByCategoryId(subcategory.id)
                    return {
                        id: subcategory.id,
                        name: subcategory.name,
                        categoryId: subcategory.category_id,
                        question_count: questionCount || 0
                    }
                })
            )
            setSubcategories(subcategoriesWithCount)
        })()
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
    }
}