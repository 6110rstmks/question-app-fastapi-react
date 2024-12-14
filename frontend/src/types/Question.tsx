
export interface Question {
    id: number;
    problem: string;
    answer: string[];
    is_correct: boolean;
    subcategory_id: number;
}