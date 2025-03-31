import { useNavigate } from "react-router";
import { Category } from "../types/Category";

export const useNavigation = () => {
    const navigate = useNavigate();

    const navigateToSubcategoryPage = (subcategoryId: number, category: Category) => {
        navigate(`/subcategory/${subcategoryId}`, {
            state: category,
        });
    };

    const navigateToCategoryPage = (categoryId: number) => {
        navigate(`/category/${categoryId}`);
    };

    return {
        navigateToSubcategoryPage,
        navigateToCategoryPage,
    };
};
