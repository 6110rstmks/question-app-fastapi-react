import React, { useEffect } from 'react'
import { useState } from 'react'
import { Question } from '../../../types/Question'
import { fetchQuestion } from '../../../api/QuestionAPI'

export const useQuestionPage = (
    question_id: number,
    initialCategoryInfo?: { [key: string]: any }
) => {
    const [question, setQuestion] = useState<Question>();
    const [categoryInfo, setCategoryInfo] = useState(() => {
        const saved = localStorage.getItem('categoryInfo');
        return saved ? JSON.parse(saved) : initialCategoryInfo || {};
    });
    useEffect(() => {
        // 質問データを取得して設定
        (async () => {
            const question = await fetchQuestion(question_id);
            setQuestion(question);
        })();

        // カテゴリ情報をローカルストレージに保存
        if (initialCategoryInfo) {
            setCategoryInfo(initialCategoryInfo);
            localStorage.setItem('categoryInfo', JSON.stringify(initialCategoryInfo));
        }
    }, [question_id, initialCategoryInfo]);

    return { question, setQuestion, categoryInfo, setCategoryInfo };
}



