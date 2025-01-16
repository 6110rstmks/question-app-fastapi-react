import React from "react";
import CategoryBox from "./CategoryBox";
import styles from "./CategoryList.module.css";
import { Category } from "../../types/Category";

interface CategoryListProps {
    categories: Category[];
    searchSubcategoryWord: string;
    searchQuestionWord: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, searchSubcategoryWord, searchQuestionWord }) => {
    return (
        <div className={styles.container}>
            <div className={styles.category_container}>
                {categories.map((category) => (
                    <CategoryBox category={category} searchSubcategoryWord={searchSubcategoryWord} searchQuestionWord={searchQuestionWord} key={category.id} />
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
