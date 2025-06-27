import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Subcategory } from '../../../types/Subcategory'
import { CategoryWithQuestionCount } from '../../../types/Category'
import { fetchAllCategoriesWithQuestions } from '../../../api/CategoryAPIA'
import { fetchSubcategoriesWithQuestionCountByCategoryId } from '../../../api/SubcategoryAPI'
import { fetchQuestionCount } from '../../../api/QuestionCountAPI'
import { fetchProblem } from '../../../api/ProblemAPI'
import { SolutionStatus } from '../../../types/SolutionStatus'

const useSetProblemPage = () => {
    const [
        solutionStatusNumber,
        setSolutionStatusNumber
    ] = useState<SolutionStatus>(0)

    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const [selectedType, setSelectedType] = useState<string>('random')
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
    const [categories, setCategories] = useState<CategoryWithQuestionCount[]>([])
    const [problemCount, setProblemCount] = useState<number>(5)
    const [showAll, setShowAll] = useState<boolean>(false)
    const [
        questionCount,
        setQuestionCount
    ] = useState<number | null>(null)

    const navigate = useNavigate()

    function toLowerFirst(str: string): string {
        if (!str) return ''
        return str.charAt(0).toLowerCase() + str.slice(1)
    }

    // サイト内ショートカットキーの設定
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.metaKey && // macOSでcommandキーまたはCapsLockキーを表す
            event.key === "Enter"
        ) {            
            event.preventDefault()
            handleSetProblem()
        }
    // なぜSolutionStatusNumberを依存配列にいれるかについては、Stale Closureの問題を避けるため
    // 理解してないのでまた調べて
    }, [solutionStatusNumber])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    // カテゴリのチェックボックスにチェックを入れたら
    const handleCheckboxChange = async (categoryId: number) => {

        setShowAll(true)
        // カテゴリに紐づくサブカテゴリを取得する
        const subcategories = await fetchSubcategoriesWithQuestionCountByCategoryId(categoryId)
        setSubcategories(subcategories)

        setSelectedCategoryIds((prevSelected) => {
            // すでにカテゴリが選択されている場合は取り除き、選択されていない場合は追加する

            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId)
            } else {
                return [...prevSelected, categoryId]
            }
        })
    }

    // ボタンをクリックしたら、問題群を生成して、問題出題画面に遷移する。その際レスポンスのデータを渡す。
    const handleSetProblem = async () => {
        console.log(SolutionStatus[solutionStatusNumber])
        if (selectedType === 'category' && 
            selectedCategoryIds.length === 0
        ) {
            alert('Please select at least one category')
            return
        }

        const response = await fetchProblem(
            selectedType,
            toLowerFirst(SolutionStatus[solutionStatusNumber]),
            problemCount, selectedCategoryIds,
            []
        )
        const problemData = await response.json()
        navigate('/problem', { 
            state: {
                problemData, 
                from: 'setProblemPage' 
            }
        })
    }

    useEffect(() => {
        (async () => {
            const response = await fetchAllCategoriesWithQuestions()
            setCategories(response)

            const questionCount = await fetchQuestionCount()
            setQuestionCount(questionCount)
        })()
    }, [])

    return {
        categories,
        questionCount,
        showAll,
        selectedType,
        setSelectedType,
        problemCount,
        setProblemCount,
        selectedCategoryIds,
        subcategories,
        handleSetProblem,
        handleCheckboxChange,
        solutionStatusNumber,
        setSolutionStatusNumber
    }
}
export default useSetProblemPage