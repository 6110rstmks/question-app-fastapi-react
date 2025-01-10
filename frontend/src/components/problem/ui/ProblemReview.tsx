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
    currentReviewProblemIndex: number;
    currentReviewProblemIndex2: number;
    problemLength: number;
    showAnswer: boolean;
    onShowAnswer: () => void;
    onSolved: () => void;
    onUnsolved: () => void;
}

const ReviewProblem: React.FC<Props> = ({ problem, currentReviewProblemIndex, currentReviewProblemIndex2, problemLength, showAnswer, onShowAnswer, onSolved, onUnsolved }) => {
    const [category, setCategory] = useState<Category | null>(null);
    const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
    const [localProblem, setLocalProblem] = useState<Question>(problem); // ローカル状態を追加

    const handleUpdateIsCorrect = async () => {
        // ローカルの状態を即座に反転
        setLocalProblem((prev) => ({
            ...prev,
            is_correct: !prev.is_correct,
        }));

        await updateQuestionIsCorrect(problem!); // API コール
        const updatedProblem = await fetchQuestion(localProblem.id); // データをリフレッシュ
        setLocalProblem(updatedProblem); // 最新のデータをローカルに反映
    }

    useEffect(() => {
        setLocalProblem(problem); // 新しい問題が渡されるたびにローカル状態を更新

        getCategoryByQuestionId(problem.id).then((data) => {
            setCategory(data);
        })
        fetchSubcategoriesByQuestionId(problem.id).then((data) => {
            setSubcategory(data);
        })
    }, [problem])
    return (
        <div>
            <div>{category?.name}＞{subcategory?.name}</div>
            <div>{currentReviewProblemIndex2 + 1} / {problemLength}</div>
            <h1>再出題: </h1>
            <div className={styles.question_problem}>問題：{localProblem.problem}</div>
            <div className={styles.question_is_flg}>
                <div
                    className={`${styles.question_is_flg_value} ${
                        localProblem.is_correct ? styles.correct : styles.incorrect
                    }`}
                    onClick={handleUpdateIsCorrect}
                >
                    {localProblem.is_correct ? '正解' : '不正解'}
                </div>
            </div>   
            <button onClick={onShowAnswer}>答えを表示する</button>
            {showAnswer && (
                <div>
                {localProblem.answer.length > 0 ? (
                    localProblem.answer.map((ans, index) => (
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

export default ReviewProblem;
