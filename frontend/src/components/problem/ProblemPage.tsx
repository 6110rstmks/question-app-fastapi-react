import React from "react";
import { useLocation } from "react-router-dom";
import { Question } from "../../types/Question";
import useProblemPage from "./hooks/useProblemPage";
import ProblemNormal from "./ui/ProblemNormal"
import ProblemReview from "./ui/ProblemReview";
import ProblemComplete from "./ui/ProblemComplete";

const ProblemPage: React.FC = () => {
    const location = useLocation();
    const problemData = location.state as Question[];
    const {
        currentProblemIndex, // 現在の問題番号
        reviewFlg, // レビューモードかどうか
        showAnswer,
        unsolvedProblems,
        currentReviewProblemIndex,
        setShowAnswer,
        handleAnswerSolved,
        handleAnswerUnsolved,
        handleReview,
    } = useProblemPage(problemData);

    if (reviewFlg && currentReviewProblemIndex >= unsolvedProblems.length) {
        return <ProblemComplete unsolvedCount={unsolvedProblems.length} onReview={handleReview} />;
    }

    if (currentProblemIndex >= problemData.length) {
        return <ProblemComplete unsolvedCount={unsolvedProblems.length} onReview={handleReview} />;
    }

    return (
        <div>
            {reviewFlg ? (
                <ProblemReview
                    problem={unsolvedProblems[currentReviewProblemIndex]}
                    showAnswer={showAnswer}
                    onShowAnswer={() => setShowAnswer(true)}
                    // onSolved={() => handleAnswerSolved(problemData[currentProblemIndex].id)}
                    onSolved={handleAnswerSolved}
                    onUnsolved={handleAnswerUnsolved}
                />
            ) : (
                <ProblemNormal
                    problem={problemData[currentProblemIndex]}
                    currentProblemIndex={currentProblemIndex}
                    problemLength={problemData.length}
                    showAnswer={showAnswer}
                    onShowAnswer={() => setShowAnswer(true)}
                    // onSolved={() => handleAnswerSolved(unsolvedProblems[0].id)}
                    onSolved={handleAnswerSolved}
                    onUnsolved={handleAnswerUnsolved}
                />
            )}
        </div>
    );
};

export default ProblemPage;
