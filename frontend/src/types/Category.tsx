export interface Category {
    id: number;
    name: string;
    user_id: number;    
}

export interface CategoryWithQuestionCount extends Category {
    question_count: number;
    incorrected_answered_question_count: number;
}