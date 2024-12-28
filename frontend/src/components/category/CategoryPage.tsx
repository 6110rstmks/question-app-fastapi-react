import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from "./CategoryPage.module.css"
import { SubcategoryWithQuestionCount } from '../../types/Subcategory';
import { Category } from '../../types/Category';

const CategoryPage = () => {
    const { category_id } = useParams<{ category_id: string }>();
    const [category, setCategory] = useState<Category>();
    const [subcategoriesList, setSubcategoriesList] = useState<SubcategoryWithQuestionCount[]>([]);
    const navigate = useNavigate();

    const handleNavigateToSubcategoryPage = (subcategory_id: number) => {
        navigate(`/subcategory/${subcategory_id}`, { 
            state: { 
                category_id: category_id, 
                category_name: category?.name 
            } 
        });
    };

    useEffect(() => {
        // カテゴリを取得
        const fetchCategory = async () => {
            const response = await fetch(`http://localhost:8000/categories/category_id/${category_id}`)
            if (response.ok) {
                const data: Category = await response.json();
                console.log(data)
                setCategory(data);
            }
        }

        // カテゴリ内にあるSubcategoriesを取得
        const fetchSubcategories = async () => {
            const response = await fetch(`http://localhost:8000/subcategories/category_id/${category_id}`);

            if (response.ok) {
                const data: SubcategoryWithQuestionCount[] = await response.json();
                setSubcategoriesList(data);
            }
        };

        fetchCategory()
        fetchSubcategories()
    }, []); 

    return (
        <div>
            <h2>{category?.name}</h2>
            {subcategoriesList.map((subcategory) => (
                <div className={styles.subcategory_name} key={subcategory.id} onClick={() => handleNavigateToSubcategoryPage(subcategory.id)}>
                    ・{subcategory.name}
                    <span>【{subcategory.question_count}】</span>
                </div>
                
            ))}
        </div>
    )
}

export default CategoryPage