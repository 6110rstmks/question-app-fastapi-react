import React, { useEffect } from 'react'
import { useState } from 'react'
import { Question } from '../../../types/Question'
import { fetchQuestion } from '../../../api/QuestionAPI'

export const useQuestionPage = (question_id: number) => {
    const [question, setQuestion] = useState<Question>();
    useEffect(() => {
        (async () => {
            const question = await fetchQuestion(question_id);
            setQuestion(question);
        })()
    }, [])

    return { question, setQuestion }
}



