import { useState, useEffect } from "react";
import { Question } from "../../../types/Question";

const useProblemPage = (problemData: Question[]) => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [reviewFlg, setReviewFlg] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [unsolvedProblems, setUnsolvedProblems] = useState<Question[]>([]);
    const [currentReviewProblemIndex, setCurrentReviewProblemIndex] = useState(0);
    const [currentReviewProblemIndex2, setCurrentReviewProblemIndex2] = useState(0);
    const [totalReviewProblemIndex, setTotalReviewProblemIndex] = useState(0);

    // 「解けた」ボタンを押すと次の問題に進む。
    const handleAnswerSolved = () => {
        setCurrentProblemIndex((prev) => prev + 1);
        setShowAnswer(false);
        // submitIsCorrect(question_id);
    };

    const handleAnswerUnsolved = () => {
        setUnsolvedProblems((prev) => [...prev, problemData[currentProblemIndex]]);
        setCurrentProblemIndex((prev) => prev + 1);
        setShowAnswer(false);
    };

    // 再度出題した用の関数
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

    // Problem(Question)に正答できたならそのQuestionのis_correctをtrueにするリクエストを送信。
    const submitIsCorrect = async (question_id: number) => {
        await fetch(`http://localhost:8000/questions/change_is_correct/${question_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_correct: true }),
        });
    };

    // 「解けなかった問題を再度復習する」ボタンを押すと問題の再出題画面に移行する。
    const handleNavigateToProblemReviewPage = () => {
        setReviewFlg(true);
        setCurrentProblemIndex(0);
        setCurrentReviewProblemIndex(0);
        setCurrentReviewProblemIndex2(0);
        setShowAnswer(false);
        setTotalReviewProblemIndex(unsolvedProblems.length)
    };

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
