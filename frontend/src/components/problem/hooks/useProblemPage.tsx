import { useState } from "react";
import { Question } from "../../../types/Question";

const useProblemPage = (problemData: Question[]) => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [reviewFlg, setReviewFlg] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [unsolvedProblems, setUnsolvedProblems] = useState<Question[]>([]);
    const [currentReviewProblemIndex, setCurrentReviewProblemIndex] = useState(0);

    // 「解けた」ボタンを押すと次の問題に進む。その際、問題のis_correctをtrueにするリクエストを送信。
    const handleAnswerSolved = (question_id: number) => {
        setCurrentProblemIndex((prev) => prev + 1);
        setShowAnswer(false);
        submitIsCorrect(question_id);
    };

    const handleAnswerUnsolved = () => {
        setUnsolvedProblems((prev) => [...prev, problemData[currentProblemIndex]]);
        setCurrentProblemIndex((prev) => prev + 1);
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

    // 「解けなかった問題を再度復習する」ボタンを押すと問題の際出題画面に移行する。
    const handleReview = () => {
        setReviewFlg(true);
        setCurrentProblemIndex(0);
        setCurrentReviewProblemIndex(0);
        setShowAnswer(false);
    };

    return {
        currentProblemIndex,
        reviewFlg,
        showAnswer,
        unsolvedProblems,
        currentReviewProblemIndex,
        setShowAnswer,
        handleAnswerSolved,
        handleAnswerUnsolved,
        handleReview,
    };
};

export default useProblemPage;
