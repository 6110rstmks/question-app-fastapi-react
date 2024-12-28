export interface Subcategory {
    id: number;
    name: string;
    category_id: number;
}

export interface SubcategoryWithQuestionCount extends Subcategory {
    question_count: number;
}
