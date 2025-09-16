import { useState, useEffect, useRef } from 'react'
import type { Subcategory2, SubcategoryWithQuestionCount } from "../../../types/Subcategory"
import { fetchSubcategoriesForHomePage, createSubcategory } from "../../../api/SubcategoryAPI"
// import { fetchQuestion } from '../../../api/QuestionAPI'
import { fetchQuestionCountBySubcategoryId } from '../../../api/QuestionCountAPI'

interface useCategoryBoxProps {
    categoryId: number,
    showForm: boolean,
    setShowForm: (showForm: boolean) => void,
    searchSubcategoryWord: string,
    searchQuestionWord: string,
    searchAnswerWord: string,
}

export const useCategoryBox = ({
    categoryId,
    showForm,
    setShowForm,
    searchSubcategoryWord,
    searchQuestionWord,
    searchAnswerWord
}: useCategoryBoxProps) => {

    const [
        subcategoriesWithQuestionCount,
        setSubcategoriesWithQuestionCount
    ] = useState<SubcategoryWithQuestionCount[]>([])

    const [
        inputSubcategoryName,
        setInputSubcategoryName
    ] = useState<string>('')

    const categoryBoxRef = useRef<HTMLDivElement | null>(null)

    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategoriesWithQuestionCount((prev) => [...prev, subcategory])
    }

    const handleAddSubcategory = async () => {
        if (!inputSubcategoryName.trim()) {
            alert('サブカテゴリー名を入力してください')
            return
        }

        const response = await createSubcategory(inputSubcategoryName, categoryId)
        const data = await response.json() as SubcategoryWithQuestionCount

        if (subcategoriesWithQuestionCount.length < 6) {
            addSubcategory(data)
        }
        setInputSubcategoryName("")
        setShowForm(false)
    }

    // この関数は showForm（フォームが表示されているかどうか）に応じて、categoryBox の高さを変える処理

    const adjustHeight = () => {
        if (categoryBoxRef.current) {
            if (showForm) {
                categoryBoxRef.current.style.height = "450px" // フォームが表示されるときの高さ
            } else {
                categoryBoxRef.current.style.height = "400.5px" // フォームが非表示のときの高さ
            }
        }
    }

    useEffect(() => {
        adjustHeight()
    }, [showForm])

    useEffect(() => {

        (async () => {
            const subcategories: Subcategory2[] = await fetchSubcategoriesForHomePage(categoryId, searchSubcategoryWord, searchQuestionWord, searchAnswerWord);

            const subcategoriesWithQuestionCount: SubcategoryWithQuestionCount[] = await Promise.all(
                subcategories.map(async (subcategory) => {
                    // 各サブカテゴリーに関連する質問の数を取得するAPIを呼び出す
                    const questionCount = await fetchQuestionCountBySubcategoryId(subcategory.id)
                    return {
                        id: subcategory.id,
                        name: subcategory.name,
                        categoryId: subcategory.category_id,
                        question_count: questionCount
                    }
                })
            )
            setSubcategoriesWithQuestionCount(subcategoriesWithQuestionCount)
        })()
    }, [searchSubcategoryWord, searchQuestionWord, searchAnswerWord])

    return { 
        subcategoriesWithQuestionCount, 
        inputSubcategoryName, 
        setInputSubcategoryName, 
        handleAddSubcategory,
        adjustHeight, 
        categoryBoxRef 
    }
}