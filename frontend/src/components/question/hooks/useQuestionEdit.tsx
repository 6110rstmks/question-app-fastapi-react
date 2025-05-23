import { useCallback, useEffect, useState } from 'react'
import { Question } from '../../../types/Question'
import { fetchQuestion } from '../../../api/QuestionAPI'
import { SolutionStatus } from '../../../types/SolutionStatus'


export const useQuestionEdit = (
    question: Question | undefined,
    setQuestion: (question: Question) => void,
    setModalIsOpen: (isOpen: boolean) => void
) => {
    const [inputAnswerValue, setInputAnswerValue] = useState<string[]>(question?.answer || [''])
    const [inputProblemValue, setInputProblemValue] = useState<string>(question?.problem || "")
    // const [isCorrect, setIsCorrect] = useState<boolean>(question?.is_correct || false)
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

    const handleProblemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputProblemValue(event.target.value);
    };

    const handleAnswerChange = (index: number, value: string) => {
        const updatedAnswers = [...inputAnswerValue];
        updatedAnswers[index] = value;
        setInputAnswerValue(updatedAnswers);
    }

    const handleIsCorrectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCorrect(event.target.value === SolutionStatus.Correct.toString() ? SolutionStatus.Correct : 
                     event.target.value === SolutionStatus.Temporary.toString() ? SolutionStatus.Temporary : 
                     SolutionStatus.Incorrect);
    }

    const addAnswerInput = () => {
        setInputAnswerValue([...inputAnswerValue, ''])
    }

    const removeAnswerInput = (indexToRemove: number) => {
        setInputAnswerValue(inputAnswerValue.filter((_, index) => index !== indexToRemove))
    }

    const handleCloseModal = () => {
        let confirmation = prompt("本当にCloseしますか？　「Y」と入力");
        if (confirmation !== 'Y') {
            return;
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

        try {
            const response = await fetch(`http://localhost:8000/questions/${question?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedQuestion),
            });

            if (!response.ok) {
                throw new Error('Failed to update the question.');
            }
            
            const data = await fetchQuestion(question!.id);
            setQuestion(data);
            alert('質問が更新されました！');
            setModalIsOpen(false);
        } catch (error) {
            console.error(error);
            alert('質問の更新に失敗しました。');
        }
    };

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
        updateQuestion,
        addAnswerInput,
        removeAnswerInput,
        handleProblemChange,
        handleIsCorrectChange,
        handleCloseModal,
        handleAnswerChange
    }
}