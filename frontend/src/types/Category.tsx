export interface Category {
    id: number;
    name: string;
    userId: number;    
}

export interface CategoryWithQuestionCount extends Category {
    question_count: number;
    incorrected_answered_question_count: number;
}