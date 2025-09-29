import { useCallback, useEffect, useState } from 'react'
import { fetchQuestionsBySubcategoryId } from '../../../client/QuestionAPI'
import type { Question } from '../../../types/Question'

export const useQuestionCreateModal = (
    categoryId: number,
    subcategoryId: number,
    setQuestions: (questions: Question[]) => void,
    setModalIsOpen: (isOpen: boolean) => void,
) => {

    const [answers, setAnswers] = useState<string[]>([''])
    const [problem, setProblem] = useState<string>('')
    const [inputMemoValue, setInputMemoValue] = useState<string>('')

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers]
        newAnswers[index] = value
        setAnswers(newAnswers)
    }

    const addAnswerField = () => {
        setAnswers([...answers, ''])
    }

    const removeAnswerInput = (indexToRemove: number) => {
        setAnswers(answers.filter((_, index) => index !== indexToRemove))
    }

    const createQuestion = async () => {
        // 問題文が空の場合はエラーを表示
        if (!problem) {
            alert('問題文を入力してください')
            return
        } 

        if (inputMemoValue.length > 1000) {
            alert('メモは1000文字以内で入力してください')
            return
        }

        await fetch('http://localhost:8000/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // ここは例外でjavascriptのコードだが、pythonコード側にデータを送るため命名方式はキャメルケースを使用する。
            body: JSON.stringify({ 
                problem: problem,
                answer: answers,
                memo: inputMemoValue,
                category_id: categoryId,
                subcategory_id: subcategoryId 
            }),
        })

        const data = await fetchQuestionsBySubcategoryId(subcategoryId)
        setQuestions(data)
        setModalIsOpen(false)
    }

    // サイト内ショートカットキーの設定
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.metaKey && // macOSでcommandキーまたはCapsLockキーを表す
            event.key === "Enter"
        ) {
            event.preventDefault()
            createQuestion()
        }
    }, [problem, answers, inputMemoValue])
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    // タッチパッド誤操作のブラウザバックを防ぐ
    const blockBrowserBack = useCallback(() => {
        window.history.go(1)
    }, [])
    
    useEffect(() => {
        // 直前の履歴に現在のページを追加
        window.history.pushState(null, '', window.location.href)
    
        // 直前の履歴と現在のページのループ
        window.addEventListener('popstate', blockBrowserBack)
    
        // クリーンアップは忘れない
        return () => {
            window.removeEventListener('popstate', blockBrowserBack)
        }
    }, [blockBrowserBack])

    return {
        problem,
        setProblem,
        answers,
        inputMemoValue,
        setInputMemoValue,
        removeAnswerInput,
        createQuestion,
        handleAnswerChange,
        addAnswerField
    }
}