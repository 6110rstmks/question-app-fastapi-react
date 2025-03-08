export interface Subcategory {
    id: number;
    name: string;
    categoryId: number;
}

// CategoryBox, CategoryPageで使用する型
export interface SubcategoryWithQuestionCount extends Subcategory {
    // questionCount: number;
    question_count: number;
}

export interface SubcategoryWithCategoryName extends Subcategory {
    categoryName: string;
}
