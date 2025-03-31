import { NavigateFunction } from "react-router"
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
    questionId: number,
    category_id: number,
    category_name?: string,
    subcategory_id?: number,
    subcategoryName?: string
) => {
    navigate(`/question/${questionId}`, { 
        state: {
            categoryId: category_id,
            subcategoryId: subcategory_id,
            categoryName: category_name,
            subcategoryName: subcategoryName,
        } 
    });
}