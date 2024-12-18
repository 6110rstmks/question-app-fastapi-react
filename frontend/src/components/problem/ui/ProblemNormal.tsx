import React, { useEffect, useState } from "react";
import { Question } from "../../../types/Question";
import { Category } from "../../../types/Category";
import { Subcategory } from "../../../types/Subcategory";
import { getCategoryByQuestionId, getSubcategoryByQuestionId } from "../../../api/QuestionAPI";

interface Props {
    problem: Question;
    showAnswer: boolean;
    onShowAnswer: () => void;
    onSolved: () => void;
    onUnsolved: () => void;
}

const ProblemNormal: React.FC<Props> = ({ problem, showAnswer, onShowAnswer, onSolved, onUnsolved }) => {
    const [category, setCategory] = useState<Category | null>(null);
    const [subcategory, setSubcategory] = useState<Subcategory | null>(null);

    useEffect(() => {
        getCategoryByQuestionId(problem.id).then((data) => {
            setCategory(data);
        })
        getSubcategoryByQuestionId(problem.id).then((data) => {
            console.log(`problem.id: ${problem.id}`);
            console.log(data);
            setSubcategory(data);
        })
    }, [problem])

    return (
        <div>
            <div>{category?.name}　＞　{subcategory?.name}</div>
            <h1>{problem.problem}</h1>
            <button onClick={onShowAnswer}>答えを表示する</button>
            {showAnswer && <p>{problem.answer}</p>}
            <div>
                <button onClick={onSolved}>解けた</button>
                <button onClick={onUnsolved}>解けなかった</button>
            </div>
        </div>
    );
};

export default ProblemNormal;
