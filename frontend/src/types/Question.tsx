import { SolutionStatus } from './SolutionStatus';

export interface Question {
    id: number
    problem: string
    answer: string[]
    memo: string
    is_correct: SolutionStatus
    answer_count: number
    last_answered_date: string
}

export interface QuestionWithCategoryIdAndCategoryNameAndSubcategoryId extends Question {
    categoryId: number
    category_name: string
    subcategoryId: number
}
