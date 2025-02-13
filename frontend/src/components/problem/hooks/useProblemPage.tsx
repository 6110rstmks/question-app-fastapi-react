import { useState, useEffect, useCallback } from "react";
import { Question } from "../../../types/Question";

const useProblemPage = (problemData: Question[]) => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [reviewFlg, setReviewFlg] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [unsolvedProblems, setUnsolvedProblems] = useState<Question[]>([]);
    const [currentReviewProblemIndex, setCurrentReviewProblemIndex] = useState(0);
    const [currentReviewProblemIndex2, setCurrentReviewProblemIndex2] = useState(0);
    const [totalReviewProblemIndex, setTotalReviewProblemIndex] = useState(0);



    // 通常モードにおいて「解けた」ボタンを押すと次の問題に進む。
    const handleAnswerSolved = () => {
        setCurrentProblemIndex((prev) => prev + 1);
        setShowAnswer(false);
    };

    // 通常モードにおいて「解けなかった」ボタンを押すと未解決の問題リストに追加され、次の問題に進む。
    const handleAnswerUnsolved = () => {
        setUnsolvedProblems((prev) => [...prev, problemData[currentProblemIndex]]);
        setCurrentProblemIndex((prev) => prev + 1);
        setShowAnswer(false);
    };

    // レビューモードで「解けた」ボタンを押すと次の問題に進む。
    const handleAnswerSolvedReview = () => {
        setUnsolvedProblems(unsolvedProblems.filter((problem) => problem.id !== unsolvedProblems[currentReviewProblemIndex].id));
        setCurrentReviewProblemIndex2((prev) => prev + 1);
        setShowAnswer(false);
    };

    // 再度出題した用の関数
    const handleAnswerUnsolvedReview = () => {
        setCurrentReviewProblemIndex((prev) => prev + 1);
        setCurrentReviewProblemIndex2((prev) => prev + 1);
        setShowAnswer(false);
    };

    // 「解けなかった問題を再度復習する」ボタンを押すと問題のレビューモードに移行する。
    const handleNavigateToProblemReviewPage = () => {
        setReviewFlg(true);
        setCurrentProblemIndex(0);
        setCurrentReviewProblemIndex(0);
        setCurrentReviewProblemIndex2(0);
        setShowAnswer(false);
        setTotalReviewProblemIndex(unsolvedProblems.length)
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!event.ctrlKey && event.key.toLowerCase() === 'b') {
            event.preventDefault();
            setShowAnswer(prev => !prev);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        window.scrollTo(0, 0);
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
    };
};

export default useProblemPage;
