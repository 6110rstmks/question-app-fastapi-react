export interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
    is_correct: boolean;
    answer_count: number;
}

export interface QuestionWithCategoryId extends Question {
    category_id: number;
}
