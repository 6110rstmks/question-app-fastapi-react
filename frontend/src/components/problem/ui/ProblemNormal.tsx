import React, { useEffect, useState } from "react";
import { Question } from "../../../types/Question";
import { Category } from "../../../types/Category";
import { Subcategory } from "../../../types/Subcategory";
import { getCategoryByQuestionId, getSubcategoryByQuestionId } from "../../../api/QuestionAPI";

interface Props {
    problem: Question;
    currentProblemIndex: number;
    problemLength: number;
    showAnswer: boolean;
    onShowAnswer: () => void;
    onSolved: () => void;
    onUnsolved: () => void;
}

const ProblemNormal: React.FC<Props> = ({ problem, currentProblemIndex, problemLength, showAnswer, onShowAnswer, onSolved, onUnsolved }) => {
    const [category, setCategory] = useState<Category | null>(null);
    const [subcategory, setSubcategory] = useState<Subcategory | null>(null);

    useEffect(() => {
        getCategoryByQuestionId(problem.id).then((data) => {
            setCategory(data);
        })
        getSubcategoryByQuestionId(problem.id).then((data) => {
            setSubcategory(data);
        })
    }, [problem])

    return (
        <div>
            <div>{category?.name}＞{subcategory?.name}</div>
            <div>{currentProblemIndex + 1} / {problemLength}</div>
            <h1>{problem.problem}</h1>
            <button onClick={onShowAnswer}>答えを表示する</button>
            {showAnswer && (
                <div>
                    {problem.answer.length > 0 ? (
                    problem.answer.map((ans, index) => (
                        <p key={index}>{ans}</p>
                    ))
                    ) : (
                    <p>解答はまだ作成されていません</p>
                    )}
                </div>
            )}
            <div>
                <button onClick={onSolved}>解けた</button>
                <button onClick={onUnsolved}>解けなかった</button>
            </div>
        </div>
    );
};

export default ProblemNormal;
