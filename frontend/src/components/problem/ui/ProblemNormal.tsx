import React, { useEffect, useState } from "react";
import { Question } from "../../../types/Question";
import { Category } from "../../../types/Category";
import { Subcategory } from "../../../types/Subcategory";
import { getCategoryByQuestionId } from "../../../api/QuestionAPI";
import { fetchSubcategoriesByQuestionId } from "../../../api/SubcategoryAPI";
import styles from './ProblemNormal.module.css'
import { updateQuestionIsCorrect, fetchQuestion } from "../../../api/QuestionAPI";

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
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    const handleUpdateIsCorrect = async () => {
        await updateQuestionIsCorrect(problem!); // API コール
    }

    useEffect(() => {
        getCategoryByQuestionId(problem.id).then((data) => {
            setCategory(data);
        })
        fetchSubcategoriesByQuestionId(problem.id).then((data) => {
            setSubcategories(data);
        })
    }, [problem])

    return (
        <div>
            <div>{currentProblemIndex + 1} / {problemLength}</div>
            {subcategories.map((subcategory) => (
                <div>{category?.name}＞{subcategory?.name}</div>
            ))}
                <div className={styles.question_problem}>問題：{problem?.problem}</div>
                <div className={styles.question_is_flg}>
                    <div
                        className={`${styles.question_is_flg_value} ${
                        problem?.is_correct ? styles.correct : styles.incorrect
                        }`}
                        onClick={handleUpdateIsCorrect}
                    >
                    {problem.is_correct ? '正解' : '不正解'}
                    </div>
                </div>            <button onClick={onShowAnswer}>答えを表示する</button>
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
