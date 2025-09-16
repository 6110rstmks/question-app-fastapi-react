import { useState, useEffect, useRef } from 'react'
import type { Subcategory, SubcategoryWithQuestionCount } from "../../../types/Subcategory"
import { fetchSubcategoriesForHomePage, createSubcategory } from "../../../api/SubcategoryAPI"
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

    // CategoryBoxに追加したサブカテゴリを表示させるための関数
    const addSubcategory = (subcategory: SubcategoryWithQuestionCount) => {
        setSubcategoriesWithQuestionCount((prev) => [...prev, subcategory])
    }

    const handleAddSubcategory = async () => {
        if (!inputSubcategoryName.trim()) {
            alert('サブカテゴリー名を入力してください')
            return
        }

        const data: Subcategory = await createSubcategory(inputSubcategoryName, categoryId)

        if (subcategoriesWithQuestionCount.length < 6) {
            const subcategoryWithQuestionCount: SubcategoryWithQuestionCount = {
                ...data,
                questionCount: 0 // 新規作成したサブカテゴリーの質問数は0で初期化
            }
            addSubcategory(subcategoryWithQuestionCount)
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
            const subcategories: Subcategory[] = await fetchSubcategoriesForHomePage(categoryId, searchSubcategoryWord, searchQuestionWord, searchAnswerWord);

            const subcategoriesWithQuestionCount: SubcategoryWithQuestionCount[] = await Promise.all(
                subcategories.map(async (subcategory) => {
                    // 各サブカテゴリーに関連する質問の数を取得するAPIを呼び出す
                    const questionCount = await fetchQuestionCountBySubcategoryId(subcategory.id)
                    return {
                        ...subcategory,
                        questionCount: questionCount
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