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

export const fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord = async (searchProblemWord: string): Promise<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]> => {
    const url = `http://localhost:8000/questions/?searchProblemWord=${searchProblemWord}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

export const fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByAnswerWord = async (searchAnswerWord: string): Promise<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]> => {
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
};

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
};

export const fetchUncorrectedQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/questions/count/uncorrected';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
};

export const fetchUncorrectedQuestionCountBySubcategoryId = async (subcategory_id: number): Promise<number> => {
    const url = `http://localhost:8000/questions/count/uncorrected/subcategory_id/${subcategory_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

export const fetchQuestionCountsByLastAnsweredDate = async (
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

// Questionのanswer_cntをインクリメントするAPI
export const incrementAnswerCount = async (question_id: number): Promise<void> => {
    const url = `http://localhost:8000/questions/increment_answer_count/${question_id}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

