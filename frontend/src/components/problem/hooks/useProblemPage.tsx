import { useState, useEffect, useCallback } from "react"
import { Question } from "../../../types/Question"
import { 
    incrementAnswerCount,
    updateLastAnsweredDate 
} from "../../../api/QuestionAPI"

export const useProblemPage = (
    problemData: Question[]
) => {
    const [
        currentProblemIndex, 
        setCurrentProblemIndex
    ] = useState<number>(0)

    const [reviewFlg, setReviewFlg] = useState(false)
    const [showAnswer, setShowAnswer] = useState(false)

    const [
        unsolvedProblems,
        setUnsolvedProblems
    ] = useState<Question[]>([])

    // currentReviewProblemIndexとcurrentReviewProblemIndex2の違いは？
    const [
        currentReviewProblemIndex,
        setCurrentReviewProblemIndex
    ] = useState(0)

    const [
        currentReviewProblemIndex2,
        setCurrentReviewProblemIndex2
    ] = useState(0)

    const [
        totalReviewProblemIndex, 
        setTotalReviewProblemIndex
    ] = useState(0)

    // 通常モードにおいて「解けた」ボタンを押すと次の問題に進む。
    const handleAnswerSolved = () => {
        setCurrentProblemIndex((prev) => prev + 1)
        setShowAnswer(false)
        incrementAnswerCount(problemData[currentProblemIndex].id)
        updateLastAnsweredDate(problemData[currentProblemIndex].id)
    };

    // 通常モードにおいて「解けなかった」ボタンを押すと未解決の問題リストに追加され、次の問題に進む。
    const handleAnswerUnsolved = () => {
        setUnsolvedProblems((prev) => [...prev, problemData[currentProblemIndex]])
        setCurrentProblemIndex((prev) => prev + 1)
        setShowAnswer(false)
    };

    // レビューモードで「解けた」ボタンを押すと次の問題に進む。
    const handleAnswerSolvedReview = () => {
        setUnsolvedProblems(unsolvedProblems.filter((problem) => problem.id !== unsolvedProblems[currentReviewProblemIndex].id))
        setCurrentReviewProblemIndex2((prev) => prev + 1)
        setShowAnswer(false)

        incrementAnswerCount(problemData[currentProblemIndex].id)
        updateLastAnsweredDate(problemData[currentProblemIndex].id)
    };

    // 再度出題した用の関数
    const handleAnswerUnsolvedReview = () => {
        setCurrentReviewProblemIndex((prev) => prev + 1)
        setCurrentReviewProblemIndex2((prev) => prev + 1)
        setShowAnswer(false)
    };

    // ProblemCompleteにおいて「解けなかった問題を再度復習する」ボタンを押すと
    // 問題のレビューモードに移行する。
    const handleNavigateToProblemReviewPage = () => {
        setReviewFlg(true)
        setCurrentProblemIndex(0);
        setCurrentReviewProblemIndex(0)
        setCurrentReviewProblemIndex2(0)
        setShowAnswer(false);
        setTotalReviewProblemIndex(unsolvedProblems.length)
    };

    // サイト内ショートカットキーの設定
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.key.toLowerCase() === 'k' ||
            event.key.toLowerCase() === 'b'
        ) {
            event.preventDefault()
            setShowAnswer(prev => !prev)
        } else if (event.key.toLowerCase() === 'j') {

            event.preventDefault()
            if (reviewFlg) {
                handleAnswerSolvedReview()
            } else {
                handleAnswerSolved()
            }
        } else if (event.key.toLowerCase() === 'l') {
            event.preventDefault()
            if (reviewFlg) {
                handleAnswerUnsolvedReview()
            } else {
                handleAnswerUnsolved()
            }
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return {
        currentProblemIndex,
        reviewFlg,
        showAnswer,
        unsolvedProblems,
        currentReviewProblemIndex,
        currentReviewProblemIndex2,
        totalReviewProblemIndex,
        setShowAnswer,
        handleAnswerSolved,
        handleAnswerUnsolved,
        handleAnswerSolvedReview,
        handleAnswerUnsolvedReview,
        handleNavigateToProblemReviewPage,
    }
}