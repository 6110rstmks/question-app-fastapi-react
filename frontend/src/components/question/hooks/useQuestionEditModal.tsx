import { useCallback, useEffect, useState } from 'react'
import type { Question } from '../../../types/Question'
import { fetchQuestion } from '../../../client/QuestionAPI'
import { SolutionStatus } from '../../../types/SolutionStatus'

export const useQuestionEditModal = (
    question: Question | undefined,
    setQuestion: (question: Question) => void,
    setModalIsOpen: (isOpen: boolean) => void
) => {
    const [inputAnswerValue, setInputAnswerValue] = useState<string[]>(question?.answer || [''])
    const [inputProblemValue, setInputProblemValue] = useState<string>(question?.problem || "")
    const [isCorrect, setIsCorrect] = useState<SolutionStatus>(question?.is_correct || SolutionStatus.Incorrect)
    const [inputMemoValue, setInputMemoValue] = useState<string>(question?.memo || "")

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

    const handleAnswerChange = (index: number, value: string) => {
        const updatedAnswers = [...inputAnswerValue]
        updatedAnswers[index] = value
        setInputAnswerValue(updatedAnswers)
    }

    const handleIsCorrectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCorrect(event.target.value === SolutionStatus.Correct.toString() ? SolutionStatus.Correct : 
                     event.target.value === SolutionStatus.Temporary.toString() ? SolutionStatus.Temporary : 
                     SolutionStatus.Incorrect)
    }
    
    const handleCloseModal = () => {
        let confirmation = prompt("本当にCloseしますか？「Y」と入力")
        if (confirmation !== 'Y') {
            return
        }
        setModalIsOpen(false)
    }

    const updateQuestion = async () => {
        const updatedQuestion = {
            problem: inputProblemValue,
            answer: inputAnswerValue,
            memo: inputMemoValue,
            is_correct: isCorrect
        }

        const response = await fetch(`http://localhost:8000/questions/${question?.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedQuestion),
        })

        if (!response.ok) {
            alert('問題の更新に失敗しました。')
            return
        }
        
        const data = await fetchQuestion(question!.id)
        setQuestion(data)
        setModalIsOpen(false)
    }

    // サイト内ショートカットキーの設定
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.metaKey && // macOSでcommandキーまたはCapsLockキーを表す
            event.key === "Enter"
        ) {
            event.preventDefault()
            updateQuestion()
        }
    }, [inputAnswerValue, inputProblemValue, inputMemoValue])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    useEffect(() => {
        setInputProblemValue(question?.problem || "")
        setInputAnswerValue(question?.answer || [''])
        setInputMemoValue(question?.memo || "")
        setIsCorrect(question?.is_correct ?? SolutionStatus.Incorrect)  // SolutionStatus を使ってデフォルトを設定
    }, [question])

    return {
        inputProblemValue,
        inputAnswerValue,
        isCorrect,
        inputMemoValue,
        setInputMemoValue,
        setInputAnswerValue,
        updateQuestion,
        setInputProblemValue,
        handleIsCorrectChange,
        handleCloseModal,
        handleAnswerChange
    }
}