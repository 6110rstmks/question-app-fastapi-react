import type { 
    Question, 
    QuestionWithCategoryIdAndCategoryNameAndSubcategoryId 
} from '../types/Question'
import { SolutionStatus } from '../types/SolutionStatus'

export const fetchQuestion = async (
    question_id: number
): Promise<Question> => {
    const url = `http://localhost:8000/questions/${question_id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// 特定のサブカテゴリに紐づくQuestionを取得するAPI
export const fetchQuestionsBySubcategoryId = async (
    subcategory_id: number
) => {
    const url = `http://localhost:8000/questions/subcategory_id/${subcategory_id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
};

// 問題文または解答を部分検索することでカテゴリID、カテゴリ名、サブカテゴリIDが付属したQuestionを取得するAPI
export const fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord = async (
    searchWord: string
): Promise<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]> => {
    const url = `http://localhost:8000/questions/?searchWord=${searchWord}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// Questionのis_correctを更新するAPI
export const updateQuestionIsCorrect = async (question: Question): Promise<void> => {
    const url = `http://localhost:8000/questions/edit_flg/${question.id}`;

    // is_correctを順番にサイクルさせるロジック
    const updatedStatus = 
        question.is_correct === SolutionStatus.Incorrect ? SolutionStatus.Temporary :
        question.is_correct === SolutionStatus.Temporary ? SolutionStatus.Correct :
        SolutionStatus.Incorrect;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            is_correct: updatedStatus
        }),
    })
    return response.json()
}

// Questionを削除するAPI
export const deleteQuestion = async (question_id: number): Promise<void> => {
    const response = await fetch(`http://localhost:8000/questions/${question_id}`, {
        method: 'DELETE',
    })
    return response.json()
}

// Calendar.tsxで使用する
// 日付ごとの問題数を取得するAPI
export const fetchQuestionCountsByLastAnsweredDate = async (
    days_array: string[]
): Promise<Record<string, number>> => {
    const url = 'http://localhost:8000/question_count/count/by_last_answered_date';
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            days_array: days_array
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Record<string, number> = await response.json();
    
    return data;
};

// Questionのanswer_countをインクリメントするAPI
export const incrementAnswerCount = async (
    question_id: number
): Promise<void> => {
    const url = `http://localhost:8000/questions/increment_answer_count/${question_id}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.json()
}

// Problem_pageにて問題を解いた際に使用する。
// Questionのlast_answered_dateを更新するAPI
export const updateLastAnsweredDate = async (
    question_id: number
): Promise<void> => {
    const url = `http://localhost:8000/questions/update_last_answered_date/${question_id}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.json()
}

