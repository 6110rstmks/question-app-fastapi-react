// 正解ステータスのEnum型を定義
export enum SolutionStatus {
    Incorrect = 0,
    Temporary = 1,
    Correct = 2,
}

export interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
    is_correct: SolutionStatus;
    answer_count: number;
}

export interface QuestionWithCategoryIdAndCategoryNameAndSubcategoryId extends Question {
    categoryId: number;
    category_name: string;
    subcategoryId: number;
}
