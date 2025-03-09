import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { SubcategoryWithCategoryName } from "../../../types/Subcategory";
import { Question } from "../../../types/Question";
import { fetchSubcategoriesWithCategoryNameByQuestionId } from "../../../api/SubcategoryAPI";
import { updateQuestionIsCorrect, fetchQuestion } from "../../../api/QuestionAPI";
import styles from './ProblemNormal.module.css'

interface Props {
    problem: Question
    currentProblemIndex: number
    problemLength: number
    showAnswer: boolean
    onShowAnswer: () => void
    onSolved: () => void
    onUnsolved: () => void
}

export const ProblemNormal: React.FC<Props> = ({
    problem,
    currentProblemIndex,
    problemLength,
    showAnswer,
    onShowAnswer,
    onSolved,
    onUnsolved
}) => {
    const [subcategoriesWithCategoryName, setSubcategoriesWithCategoryName] = useState<SubcategoryWithCategoryName[]>([])
    const [localProblem, setLocalProblem] = useState<Question>(problem) // ローカル状態を追加(画面で表示する用)

    const handleUpdateIsCorrect = async () => {
        await updateQuestionIsCorrect(localProblem!); // API コール
        const updatedProblem = await fetchQuestion(localProblem.id); // データをリフレッシュ
        setLocalProblem(updatedProblem); // 最新のデータをローカルに反映
    }

    useEffect(() => {
        setLocalProblem(problem); // 新しい問題が渡されるたびにローカル状態を更新

        fetchSubcategoriesWithCategoryNameByQuestionId(problem.id).then((data) => {
            // setSubcategories(data);
            setSubcategoriesWithCategoryName(data);
        })
    }, [problem])

    return (
        <div>
            <div>{currentProblemIndex + 1} / {problemLength}</div>
            <div>
                {subcategoriesWithCategoryName.map((subcategoryWithCategoryName, index) => (         
                    <div key={index}>
                        <Link to={`/category/${subcategoryWithCategoryName.categoryId}`}>{subcategoryWithCategoryName.category_name}</Link>
                        <span> ＞ </span>
                        <Link
                            to={`/subcategory/${subcategoryWithCategoryName.id}`}
                            state={{ id: subcategoryWithCategoryName.categoryId, name: subcategoryWithCategoryName.category_name }}
                        >{subcategoryWithCategoryName.name}</Link>
                    </div>
                ))}
            </div>
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
                    <div>
                        {localProblem.answer.length > 0 ? (
                            localProblem?.answer.map((answer, index) => (
                                <div key={index}>
                                    {answer.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p>解答はまだ作成されていません</p>
                        )}
                    </div>
                    <div>{localProblem.memo}</div>
                </div>
            )}
            <div>
                <button onClick={onSolved}>解けた</button>
                <button onClick={onUnsolved}>解けなかった</button>
            </div>
        </div>
    );
};

