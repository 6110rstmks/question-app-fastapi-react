import { NavigateFunction } from "react-router-dom"
import { Category } from "../types/Category"

interface categoryInfo {
    id: number;
    name: string;
}

export const handleNavigateToSubcategoryPage = (navigate: NavigateFunction, category: Category, subcategoryId: number) => {
    navigate(`/subcategory/${subcategoryId}`, {
        state: category
    });
}

export const handleNavigateToCategoryPage = (navigate: NavigateFunction, category: Category) => {
    navigate(`/category/${category.id}`);
}

export const handleNavigateToQuestionPage = (
    navigate: NavigateFunction,
    question_id: number,
    categoryInfo?: categoryInfo,
    subcategory_id?: number,
    subcategoryName?: string
) => {
    navigate(`/question/${question_id}`, { 
        state: {
            category_id: categoryInfo?.id,
            subcategory_id: subcategory_id,
            categoryName: categoryInfo?.name,
            subcategoryName: subcategoryName,
        } 
    });
}