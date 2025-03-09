import { Question, QuestionWithCategoryIdAndCategoryNameAndSubcategoryId } from '../types/Question';

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

export const fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdBySearchProblemWord = async (searchProblemWord: string): Promise<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]> => {
    const url = `http://localhost:8000/questions/?searchProblemWord=${searchProblemWord}`;
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
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
                                is_correct: !question?.is_correct 
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
    const url = 'http://localhost:8000/questions/uncorrected_count';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
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