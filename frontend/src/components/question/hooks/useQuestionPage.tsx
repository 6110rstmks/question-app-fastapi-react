import React, { useEffect } from 'react'
import { useState } from 'react'
import { Question } from '../../../types/Question'
import { fetchQuestion } from '../../../api/QuestionAPI'
import { fetchSubcategoriesByQuestionId } from '../../../api/SubcategoryAPI'
import { Subcategory } from '../../../types/Subcategory'

export const useQuestionPage = (
    question_id: number,
    initialCategoryInfo?: { [key: string]: any }
) => {
    const [question, setQuestion] = useState<Question>();
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    const [categoryInfo, setCategoryInfo] = useState(() => {
        const saved = localStorage.getItem('categoryInfo');
        return saved ? JSON.parse(saved) : initialCategoryInfo || {};
    });

    useEffect(() => {
        // 質問データを取得して設定
        (async () => {
            const data: Question = await fetchQuestion(question_id);
            setQuestion(data);

            // 所属するサブカテゴリを変更する際に使用する。
            const data2: Subcategory[] = await fetchSubcategoriesByQuestionId(question_id);
            setSubcategories(data2);
        })();

        // カテゴリ情報をローカルストレージに保存
        // ローカルストレージに保存する理由は、リロード時にカテゴリ情報が消えないようにするため
        // リロードした場合、QuestionPageからカテゴリ情報を取得できないため、カテゴリ情報はローカルストレージから取得する
        if (initialCategoryInfo) {
            setCategoryInfo(initialCategoryInfo);
            localStorage.setItem('categoryInfo', JSON.stringify(initialCategoryInfo));
        }
    }, [question_id, initialCategoryInfo]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return { subcategories, setSubcategories, question, setQuestion, categoryInfo, setCategoryInfo };
}



