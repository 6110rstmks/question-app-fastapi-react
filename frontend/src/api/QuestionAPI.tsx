import { Question, QuestionWithCategoryIdAndCategoryNameAndSubcategoryId } from '../types/Question';
import { SolutionStatus } from '../types/SolutionStatus';

export const fetchQuestion = async (question_id: number): Promise<Question> => {
    const url = `http://localhost:8000/questions/${question_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 特定のサブカテゴリに紐づくQuestionを取得するAPI
export const fetchQuestionsBySubcategoryId = async (subcategory_id: number) => {
    const url = `http://localhost:8000/questions/subcategory_id/${subcategory_id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
};

// 問題文を部分検索することでカテゴリID、カテゴリ名、サブカテゴリIDが付属したQuestionを取得するAPI
export const fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord = async (
    searchProblemWord: string
): Promise<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]> => {
    const url = `http://localhost:8000/questions/?searchProblemWord=${searchProblemWord}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 解答を部分検索することでカテゴリID、カテゴリ名、サブカテゴリIDが付属したQuestionを取得するAPI
export const fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByAnswerWord = async (
    searchAnswerWord: string
): Promise<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]> => {
    const url = `http://localhost:8000/questions/?searchAnswerWord=${searchAnswerWord}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
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
    });
}

// Questionを削除するAPI
export const deleteQuestion = async (question_id: number): Promise<void> => {
    const response = await fetch(`http://localhost:8000/questions/${question_id}`, {
        method: 'DELETE',
    });
}

// すべてのQuestionの数を取得するAPI
export const fetchQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/questions/count';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 特定のカテゴリ内の不正解のQuestionの数を取得するAPI
export const fetchUncorrectedQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = `http://localhost:8000/questions/count/uncorrected/category_id/${category_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 特定のカテゴリ内の1ヶ月前より前に解いた正解のQuestionの数を取得するAPI
export const fetchCorrectedQuestionCountByCategoryIdOrderThanOneMonth = async (
    category_id: number
): Promise<number> => {
    const url = `http://localhost:8000/questions/count/corrected/category_id/${category_id}/order_than_one_month`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    console.log('fetchCorrectedQuestionCountByCategoryIdOrderThanOneMonth response:', response);
    return await response.json();
}

// 特定のカテゴリ内のTemporaryのQuestionの数を取得するAPI
export const fetchTemporaryQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = `http://localhost:8000/questions/count/temporary/category_id/${category_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 特定のカテゴリ内の正解のQuestionの数を取得するAPI
export const fetchCorrectedQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = `http://localhost:8000/questions/count/corrected/category_id/${category_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// すべての不正解のQuestionの数を取得するAPI
export const fetchUncorrectedQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/questions/count/uncorrected';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 特定のサブカテゴリ内の不正解のQuestionの数を取得するAPI
export const fetchUncorrectedQuestionCountBySubcategoryId = async (
    subcategory_id: number
): Promise<number> => {
    const url = `http://localhost:8000/questions/count/uncorrected/subcategory_id/${subcategory_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 日付ごとの問題数を取得するAPI
export const fetchQuestionsCountsByLastAnsweredDate = async (
    days_array: string[]
): Promise<Record<string, number>> => {
    const url = 'http://localhost:8000/questions/count/by_last_answered_date';
    
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
    });
}

export const updateLastAnsweredDate = async (
    question_id: number
): Promise<void> => {
    const url = `http://localhost:8000/questions/update_last_answered_date/${question_id}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

