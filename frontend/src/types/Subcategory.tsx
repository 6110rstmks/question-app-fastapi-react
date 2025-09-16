export interface Subcategory {
    id: number
    name: string
    categoryId: number
}

export interface Subcategory2 {
    id: number
    name: string
    category_id: number
}

// CategoryBox, CategoryPageで使用する型
export interface SubcategoryWithQuestionCount extends Subcategory {
    // questionCount: number;
    question_count: number
}

// export interface SubcategoryWithCategoryName extends Subcategory {
export interface SubcategoryWithCategoryName {
    id: number
    name: string
    category_id: number
    category_name: string
}
