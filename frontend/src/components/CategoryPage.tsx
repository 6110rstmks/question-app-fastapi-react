import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from "./CategoryPage.module.css"

export interface Subcategory {
    id: number;
    name: string;
    category_id: number;
}

export interface Category {
    id: number;
    name: string;
}

const CategoryPage = () => {
    const { category_id } = useParams<{ category_id: string }>();
    const [category, setCategory] = useState<Category>();
    const [subcategoriesList, setSubcategoriesList] = useState<Subcategory[]>([]);
    const navigate = useNavigate();

    const handleSubcategoryClick = (subcategory_id: number) => {
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

        // カテゴリ内にあるサブカテゴリを取得
        const fetchSubcategories = async () => {
            const response = await fetch(`http://localhost:8000/subcategories/category_id/${category_id}`);

            if (response.ok) {
                const data: Subcategory[] = await response.json();
                setSubcategoriesList(data);
            }
        };

        // サブカテゴリ内にある問題数を取得
        const fetchSubcategoryQuestionCount = async () => {
            const response = await fetch(`http://localhost:8000/subcategories/question_count/${category_id}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
            }
        }

        fetchCategory()
        fetchSubcategories()
    }, []); 

    return (
        <div>
            <h2>{category?.name}</h2>
            {subcategoriesList.map((subcategory) => (
                <div className={styles.subcategory_name} key={subcategory.id} onClick={() => handleSubcategoryClick(subcategory.id)}>・{subcategory.name}</div>
            ))}
        </div>
    )
}

export default CategoryPage