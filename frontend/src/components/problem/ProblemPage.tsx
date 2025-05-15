import React from "react"
import { useLocation } from "react-router"
import { Question } from "../../types/Question"
import { useProblemPage } from "./hooks/useProblemPage"
import { ProblemNormalPage } from "./ui/ProblemNormalPage"
import { ProblemComplete } from "./ui/ProblemCompletePage"

const ProblemPage: React.FC = () => {
    const location = useLocation()
    const { problemData, from, backToId } = location.state as {
        problemData: Question[]
        from: string
        backToId: number
    };

    const {
        currentProblemIndex, // 現在の問題番号
        reviewFlg, // レビューモードかどうか
        showAnswer, // 答えを表示する
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
    } = useProblemPage(problemData);

    const isNormalFinished = currentProblemIndex >= problemData.length;
    const isReviewFinished = reviewFlg && currentReviewProblemIndex >= unsolvedProblems.length;

    if (isNormalFinished || isReviewFinished) {
        return (
            <ProblemComplete
                unsolvedCount={unsolvedProblems.length}
                onReview={handleNavigateToProblemReviewPage}
                from={from}
                backToId={backToId}
            />
        );
    }

    return (
        <div>
            <ProblemNormalPage
                reviewFlg={reviewFlg}
                problem={
                    reviewFlg 
                        ? unsolvedProblems[currentReviewProblemIndex] 
                        : problemData[currentProblemIndex]
                }
                currentProblemIndex={
                    reviewFlg 
                        ?  currentReviewProblemIndex2
                        : currentProblemIndex
                }
                problemLength={
                    reviewFlg 
                        ? totalReviewProblemIndex 
                        : problemData.length
                }
                showAnswer={showAnswer}
                onShowAnswer={() => setShowAnswer(true)}
                onSolved={
                    reviewFlg 
                        ? handleAnswerSolvedReview 
                        : handleAnswerSolved
                }
                onUnsolved={
                    reviewFlg 
                        ? handleAnswerUnsolvedReview 
                        : handleAnswerUnsolved
                }
            />
        </div>
    );
};

export default ProblemPage;
