export interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
    is_correct: boolean;
    answer_count: number;
}

export interface QuestionWithCategoryIdAndCategoryNameAndSubcategoryId extends Question {
    categoryId: number;
    category_name: string;
    subcategoryId: number;
}
