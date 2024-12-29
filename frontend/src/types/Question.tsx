export interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
    is_correct: boolean;
    subcategory_id: number;
}