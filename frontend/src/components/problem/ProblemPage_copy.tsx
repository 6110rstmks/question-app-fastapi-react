import { useParams, Link, useLocation } from 'react-router-dom';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Question } from '../../types/Question';

import "./ProblemPage.module.css"

const ProblemPage: React.FC = () => {
    const location = useLocation();
    const problemData = location.state as Question[];
    
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [reviewFlg, setReviewFlg] = useState(false);

    // 問題の解答を表示するかどうかのフラグ
    const [showAnswer, setShowAnswer] = useState(false);

    // 再出題用の変数
    const [unsolvedProblems, setUnsolvedProblems] = useState<Question[]>([]);
    const [unsolvedProblemsIndex, setUnsolvedProblemsIndex] = useState<number>(0);
    const [unsolvedProblemsNumber, setUnsolvedProblemsNumber] = useState<number>();

    // 再出題となった問題の現在の問題番号を表す変数
    const [currentReviewProblemIndex, setCurrentReviewProblemIndex] = useState<number>(0);

    const displayAnswer = () => {
        setShowAnswer(true);
    }

    const handleAnswer_solved = (question_id: number) => {
        setCurrentProblemIndex(currentProblemIndex + 1);

        // 問題に回答したら、次の問題に進んだ時のために解答を非表示にする。
        setShowAnswer(false);
        submitIsCorrect(question_id)
    };

    const handleAnswer_unsolved = (id: number) => {
        setUnsolvedProblems([...unsolvedProblems, problemData[currentProblemIndex]]);
        setCurrentProblemIndex(currentProblemIndex + 1);
        setShowAnswer(false);
    };

    // 問題に回答したらサーバにそのQuestionのis_correctをtrueにするpostメソッドを送信。
    const submitIsCorrect = async (question_id: number) => {
        const response = await fetch(`http://localhost:8000/questions/change_is_correct/${question_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_correct: true }),
        })
    }

    // 再度出題した用の関数
    const handleAnswer_solved_review = () => {
        setUnsolvedProblems(unsolvedProblems.filter((problem) => problem.id !== unsolvedProblems[0].id));
        setCurrentReviewProblemIndex(currentReviewProblemIndex + 1);
        setShowAnswer(false);
    };

    // 再度出題した用の関数
    const handleAnswer_unsolved_review = () => {
        setCurrentReviewProblemIndex(currentReviewProblemIndex + 1);
        setShowAnswer(false);

    };

    // もう一度解けなかった問題に絞って解く。
    const handleReview = () => {
        setReviewFlg(true)
        setCurrentProblemIndex(0);
        setCurrentReviewProblemIndex(0);
        setUnsolvedProblemsNumber(unsolvedProblems.length)
        setShowAnswer(false);
    }

    if (currentProblemIndex == problemData.length || currentReviewProblemIndex == unsolvedProblemsNumber) {
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

    if (reviewFlg && currentReviewProblemIndex == unsolvedProblemsNumber) {
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
                        <h2>{problemData[currentProblemIndex].problem}<span className='is_correct_text'>{problemData[currentProblemIndex]?.is_correct ? "正答している" : "まだ正答していない"}</span></h2>
                            <button onClick={displayAnswer}>答えを表示する</button>
                        <h2>
                            {showAnswer && (
                                <>
                                    {problemData[currentProblemIndex].answer}
                                </>
                            )}
                        </h2>                   
                    </div>
                    <button onClick={() => handleAnswer_solved(problemData[currentProblemIndex].id)}>解けた</button>
                    <button onClick={() => handleAnswer_unsolved(problemData[currentProblemIndex].id)}>解けなかった</button>
                </div>
            ) : (
                <div>
                    <h1>【再出】問題{currentReviewProblemIndex + 1}/{unsolvedProblemsNumber}</h1>
                    <div>
                        <h2>{unsolvedProblems[unsolvedProblemsIndex].problem}<span>{unsolvedProblems[unsolvedProblemsIndex]?.is_correct ? "正答している" : "まだ正答していない"}</span></h2>
                        <button onClick={displayAnswer}>答えを表示する</button>
                        <h2>
                            {showAnswer && (
                                <>
                                    {problemData[currentProblemIndex].answer}
                                </>
                            )}
                        </h2>   
                    </div>
                    <button onClick={handleAnswer_solved_review}>解けた</button>
                    <button onClick={handleAnswer_unsolved_review}>解けなかった</button>
                </div>
            )}
        </div>
    )
}

export default ProblemPage