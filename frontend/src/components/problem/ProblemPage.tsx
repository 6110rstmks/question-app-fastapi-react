import React from "react"
import { useLocation } from "react-router"
import { Question } from "../../types/Question"
import { useProblemPage } from "./hooks/useProblemPage"
import { ProblemNormal } from "./ui/ProblemNormalPage"
import { ProblemReview } from "./ui/ProblemReviewPage"
import { ProblemComplete } from "./ui/ProblemComplete"

const ProblemPage: React.FC = () => {
    const location = useLocation()
    const problemData = location.state as Question[]
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

    // レビューモードが終わったら、終了画面を表示
    if (reviewFlg && currentReviewProblemIndex >= unsolvedProblems.length) {
        return <ProblemComplete unsolvedCount={unsolvedProblems.length} onReview={handleNavigateToProblemReviewPage} />
    }

    // 通常出題が終わったら、終了画面を表示
    if (currentProblemIndex >= problemData.length) {
        return <ProblemComplete unsolvedCount={unsolvedProblems.length} onReview={handleNavigateToProblemReviewPage} />
    }

    return (
        <div>
            {/* {reviewFlg ? (
                <ProblemReview
                    problem={unsolvedProblems[currentReviewProblemIndex]}
                    currentReviewProblemIndex2={currentReviewProblemIndex2}
                    problemLength={totalReviewProblemIndex}
                    showAnswer={showAnswer}
                    onShowAnswer={() => setShowAnswer(true)}
                    onSolved={handleAnswerSolvedReview}
                    onUnsolved={handleAnswerUnsolvedReview}
                />
            ) : (
                <ProblemNormal
                    problem={problemData[currentProblemIndex]}
                    currentProblemIndex={currentProblemIndex}
                    problemLength={problemData.length}
                    showAnswer={showAnswer}
                    onShowAnswer={() => setShowAnswer(true)}
                    onSolved={handleAnswerSolved}
                    onUnsolved={handleAnswerUnsolved}
                />
            )} */}
                <ProblemNormal
                    reviewFlg={reviewFlg}
                    problem={reviewFlg ? unsolvedProblems[currentReviewProblemIndex] : problemData[currentProblemIndex]}
                    currentProblemIndex={reviewFlg ?  currentReviewProblemIndex2: currentProblemIndex}
                    problemLength={reviewFlg ? totalReviewProblemIndex : problemData.length}
                    showAnswer={showAnswer}
                    onShowAnswer={() => setShowAnswer(true)}
                    onSolved={reviewFlg ? handleAnswerSolvedReview : handleAnswerSolved}
                    onUnsolved={reviewFlg ? handleAnswerUnsolvedReview : handleAnswerUnsolved}
                />
        </div>
    );
};

export default ProblemPage;
