import React from "react";
import CategoryBox from "./CategoryBox";
import styles from "./CategoryList.module.css";
import { Category } from "../../types/Category";

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
        <div className={styles.container}>
            <div className={styles.category_container}>
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
    );
};

