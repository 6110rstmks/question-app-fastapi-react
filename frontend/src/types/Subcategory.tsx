export interface Subcategory {
    id: number
    name: string
    categoryId: number
}

export interface OriginalSubcategory {
    id: number
    name: string
    category_id: number
}

// CategoryBox, CategoryPageで使用する型
export interface SubcategoryWithQuestionCount extends Subcategory {
    questionCount: number
}

export interface SubcategoryWithCategoryName extends Subcategory {
    categoryName: string
}
