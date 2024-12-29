export interface Subcategory {
    id: number;
    name: string;
    category_id: number;
}

// CategoryBox, CategoryPageで使用する型
export interface SubcategoryWithQuestionCount extends Subcategory {
    question_count: number;
}
