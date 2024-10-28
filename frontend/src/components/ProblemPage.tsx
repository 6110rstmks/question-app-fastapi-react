import { useParams, Link, useLocation } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';

interface Question {
    id: number;
    problem: string;
    answer: string[];
    subcategory_id: number;
}

const ProblemPage: React.FC = () => {
    const location = useLocation();
    const problemData = location.state as Question[];
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [reviewFlg, setReviewFlg] = useState(false);

    // 再出題用の変数
    const [unsolvedProblems, setUnsolvedProblems] = useState<Question[]>([]);
    const [unsolvedProblemsIndex, setUnsolvedProblemsIndex] = useState<number>(0);

    // 再出題となった問題の数を表す変数
    const [currentReviewProblemIndex, setCurrentReviewProblemIndex] = useState(0);

    const handleAnswer_solved = () => {
        setCurrentProblemIndex(currentProblemIndex + 1);
    };

    const handleAnswer_unsolved = () => {
        setUnsolvedProblems([...unsolvedProblems, problemData[currentProblemIndex]]);
        setCurrentProblemIndex(currentProblemIndex + 1);
    };

    // 再度出題した用の関数
    const handleAnswer_solved_review = () => {
        console.log(unsolvedProblems[currentReviewProblemIndex].id)
        setUnsolvedProblems(unsolvedProblems.filter((problem) => problem.id !== unsolvedProblems[currentReviewProblemIndex].id));
        console.log(unsolvedProblems)
        setCurrentReviewProblemIndex(currentReviewProblemIndex + 1);
    };

    // 再度出題した用の関数
    const handleAnswer_unsolved_review = () => {
        setUnsolvedProblemsIndex(unsolvedProblemsIndex + 1);
    };

    // もう一度解けなかった問題に絞って解く。
    const handleReview = () => {
        console.log(unsolvedProblems)
        setReviewFlg(true)
        setCurrentProblemIndex(0);
        setCurrentReviewProblemIndex(0);
    }

    if (currentProblemIndex == problemData.length) {
        return <div>
            <h1>終了</h1>
            {unsolvedProblems.length > 0 ? (
                <button onClick={handleReview}>解けなかった問題に絞ってもう一度復習する</button>

            ) : (
                <div>
                    <div>全問正解</div>
                    <button>ホームに戻る</button>
                </div>
            )}
        </div>;
    }

    if (reviewFlg && currentReviewProblemIndex > unsolvedProblems.length) {
        return <div>
            <h1>【再出題】終了</h1>
            <button onClick={handleReview}>解けなかった問題に絞ってもう一度復習する</button>
        </div>;
    }

    return (
        <div>
            {!reviewFlg ? (
                <div>
                    <h1>問題{currentProblemIndex + 1}/{problemData.length}</h1>
                    <div>
                        <h2>{problemData[currentProblemIndex].problem}</h2>
                        <h2>{problemData[currentProblemIndex].answer}</h2>
                    </div>
                    <button onClick={handleAnswer_solved}>解けた</button>
                    <button onClick={handleAnswer_unsolved}>解けなかった</button>
                </div>
            ) : (
                <div>
                    <h1>【再出】問題{currentReviewProblemIndex + 1}/{unsolvedProblems.length}</h1>
                    <div>
                        <h2>{unsolvedProblems[unsolvedProblemsIndex].problem}</h2>
                        <h2>{unsolvedProblems[unsolvedProblemsIndex].answer}</h2>
                        {/* <button onClick={() => handleAnswer(true)}>○</button>
                        <button onClick={() => handleAnswer(false)}>×</button> */}
                    </div>
                    <button onClick={handleAnswer_solved_review}>解けた</button>
                    <button onClick={handleAnswer_unsolved_review}>解けなかった</button>
                </div>
            )}
        </div>
    )
}

export default ProblemPage