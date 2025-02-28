export interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
    is_correct: boolean;
    answer_count: number;
}

export interface QuestionWithCategoryIdAndCategoryNameAndSubcategoryId extends Question {
    category_id: number;
    category_name: string;
    subcategory_id: number;
}
