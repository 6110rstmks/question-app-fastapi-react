import { Question } from '../types/Question';

export const fetchQuestion = async (question_id: number) => {
    const url = `http://localhost:8000/questions/${question_id}`;
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
}

// Questionのis_correctを更新するAPI
export const updateQuestionIsCorrect = async (question: Question) => {
    const response = await fetch(`http://localhost:8000/questions/edit_flg/${question.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
                                is_correct: !question?.is_correct 
                            }),
    });
    if (!response.ok) {
        throw new Error('Failed to update is_correct');
    }
}

// Questionを削除するAPI
export const deleteQuestion = async (question_id: number): Promise<void> => {
    const response = await fetch(`http://localhost:8000/questions/${question_id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete question');
    }
};

export const fetchQuestionsBySubcategoryId = async (subcategory_id: number) => {
    const response = await fetch(`http://localhost:8000/questions/subcategory_id/${subcategory_id}`);
    if (response.ok) {
        return await response.json();
    }
};

// すべてのQuestionの数を取得するAPI
export const fetchQuestionCount = async () => {
    const response = await fetch('http://localhost:8000/questions/count');
    if (response.ok) {
        return await response.json();
    }
};

export const fetchUncorrectedQuestionCount = async () => {
    const response = await fetch('http://localhost:8000/questions/uncorrected_count');
    if (response.ok) {
        return await response.json();
    }
};

// Questionのanswer_cntをインクリメントするAPI
export const incrementAnswerCount = async (question_id: number) => {
    const response = await fetch(`http://localhost:8000/questions/increment_answer_count/${question_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Failed to increment answer_cnt');
    }
}