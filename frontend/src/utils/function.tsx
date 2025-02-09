import { SubcategoryWithQuestionCount } from "../types/Subcategory";

export const addSubcategory = (
    setSubcategories: React.Dispatch<React.SetStateAction<SubcategoryWithQuestionCount[]>>,
    subcategory: SubcategoryWithQuestionCount
) => {
    setSubcategories((prev) => [...prev, subcategory]);
};