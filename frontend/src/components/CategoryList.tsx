import React from "react";
import CategoryBox from "./CategoryBox";
import styles from "./CategoryList.module.css";
import { Category } from "../types/Category";

interface CategoryListProps {
    categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
    return (
        <div className={styles.container}>

            <div className={styles.category_container}>
                {categories.map((category) => (
                    <CategoryBox category={category} key={category.id} />
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
