import { NavigateFunction } from "react-router-dom"
import { Category } from "../types/Category"

export const handleNavigateToSubcategoryPage = (navigate: NavigateFunction, category: Category, subcategoryId: number) => {
    navigate(`/subcategory/${subcategoryId}`, {
        state: category
    });
}

export const handleNavigateToCategoryPage = (navigate: NavigateFunction, category: Category) => {
    navigate(`/category/${category.id}`);
}