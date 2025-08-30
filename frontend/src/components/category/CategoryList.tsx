import React from "react";
import CategoryBox from "./CategoryBox";
import type { Category } from "../../types/Category";

interface CategoryListProps {
    categories: Category[]
    searchSubcategoryWord: string
    searchQuestionWord: string
    searchAnswerWord: string
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
    categories, 
    searchSubcategoryWord,
    searchQuestionWord,
    searchAnswerWord 
}) => {
    return (
        <div className="p-4 md:p-6">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
                {categories.map((category) => (
                    <CategoryBox 
                        category={category} 
                        searchSubcategoryWord={searchSubcategoryWord}
                        searchQuestionWord={searchQuestionWord}
                        searchAnswerWord={searchAnswerWord}
                        key={category.id} 
                    />
                ))}
            </div>
        </div>
    )
}

