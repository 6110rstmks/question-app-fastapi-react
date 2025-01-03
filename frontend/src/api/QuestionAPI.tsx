import { Question } from '../types/Question';

// Questionに紐づくCategoryを取得するAPI
export const getCategoryByQuestionId = async (question_id: number) => {
    const response = await fetch(`http://localhost:8000/questions/get_category/${question_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

export const fetchQuestion = async (question_id: number) => {
    const url = `http://localhost:8000/questions/${question_id}`;
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
}

// Questionのis_correctを更新するAPI
export const updateIsCorrect = async (question: Question) => {
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
    fetchQuestion(question.id);
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