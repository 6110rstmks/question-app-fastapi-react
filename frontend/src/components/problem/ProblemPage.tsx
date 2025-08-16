import React from "react"
import { useLocation } from "react-router"
import { Question } from "../../types/Question"
import { useProblemPage } from "./hooks/useProblemPage"
import { ProblemNormalPage } from "./ui/ProblemNormalPage"
import { ProblemCompletePage } from "./ui/ProblemCompletePage"

const ProblemPage: React.FC = () => {
    const location = useLocation()
    const { problemData, from, backToId } = location.state as {
        problemData: Question[]
        from: string
        backToId: number // 戻る先のID(カテゴリIDまたはサブカテゴリIDが入る)
    }

    const {
        currentProblemIndex, // 現在の問題番号
        reviewFlg, // レビューモードかどうか
        showAnswer, // 答えを表示する
        unsolvedProblems,
        currentReviewProblemIndex,
        currentReviewProblemIndex2,
        totalReviewProblemIndex,
        editModalIsOpen,
        changeSubcategoryModalIsOpen,
        setEditModalIsOpen,
        setChangeSubcategoryModalIsOpen,
        setShowAnswer,
        handleAnswerSolved,
        handleAnswerUnsolved,
        handleAnswerSolvedReview,
        handleAnswerUnsolvedReview,
        handleNavigateToProblemReviewPage,
    } = useProblemPage(problemData);

    const isNormalFinished = 
        currentProblemIndex >= problemData.length

    const isReviewFinished = 
        reviewFlg && currentReviewProblemIndex >= unsolvedProblems.length

    if (isNormalFinished || isReviewFinished) {
        return (
            <ProblemCompletePage
                unsolvedCount={unsolvedProblems.length}
                handleNavigateToProblemReviewPage={handleNavigateToProblemReviewPage}
                from={from}
                backToId={backToId}
            />
        )
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
                problemData={
                    reviewFlg 
                        ? unsolvedProblems 
                        : problemData
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
                editModalIsOpen={editModalIsOpen}
                setEditModalIsOpen={setEditModalIsOpen}
                changeSubcategoryModalIsOpen={changeSubcategoryModalIsOpen}
                setChangeSubcategoryModalIsOpen={setChangeSubcategoryModalIsOpen}
            />
        </div>
    )
}

export default ProblemPage
