import React from 'react'
import { useEffect, useState } from 'react'
import { fetchSubcategory } from '../../../api/SubcategoryAPI'
import { fetchQuestionsBySubcategoryId } from '../../../api/QuestionAPI'
import { Question } from '../../../types/Question'

export const useSubcategoryPage = (subcategoryId: number) => {
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        // CategoryBoxからSubcategoryPageに移動する際に、CategoryBoxがページの下の方の場合、
        // SubcategoryPageに移動した際にページの一番上にスクロールする。
        window.scrollTo(0, 0);

        (async () => {
            const data = await fetchQuestionsBySubcategoryId(subcategoryId);
            setQuestions(data);

            const data2 = await fetchSubcategory(subcategoryId);
            setSubcategoryName(data2.name)
        })();
    }, [subcategoryId]);
    return { subcategoryName, setSubcategoryName, questions, setQuestions }
}

