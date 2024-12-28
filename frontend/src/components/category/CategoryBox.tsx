import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import styles from "./CategoryBox.module.css"
import { Category } from "../../types/Category"
import { Subcategory, SubcategoryWithQuestionCount } from "../../types/Subcategory"
import { useCategoryBox } from "./hooks/useCategoryBox"

interface CategoryBoxProps {
    category: Category
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ category }) => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [subcategoryName, setSubcategoryName] = useState('');
    // const { subcategories, questionCounts, fetchSubcategories, fetchQuestionCount, addSubcategory } = useCategoryBox(category.id);
    const { subcategories, fetchSubcategories, fetchQuestionCount, addSubcategory } = useCategoryBox(category.id);

    const navigate = useNavigate();
    useEffect(() => {
        console.log(subcategories)
        // const fetchQuestionCount2 = async (subcategoryId: number) => {
        //     const response = await fetch(`http://localhost:8000/questions/count?subcategory_id=${subcategoryId}`);
        //     if (response.ok) {
        //         const { count } = await response.json();
        //         console.log(count)
        //         setQuestionCounts((prev) => ({ ...prev, [subcategoryId]: count }));
        //     }
        // };
        fetchSubcategories();
        // fetchQuestionCount2(category.id);
    }, [fetchSubcategories]);

    const handleClick = () => {
        setShowForm(!showForm);
    }

    const handleCreateSubcategory = async () => {
        if (!subcategoryName.trim()) return;

        try {
            const response = await fetch('http://localhost:8000/subcategories/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: subcategoryName, category_id: category.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to create subcategory');
            }

            const data = await response.json() as SubcategoryWithQuestionCount;
            addSubcategory(data);
            setSubcategoryName("");
            setShowForm(false);
        } catch (error) {
            console.error("Error creating subcategory:", error);
        }
    }

    const handleNavigateToSubcategoryPage = (subcategoryId: number) => {
        navigate(`/subcategory/${subcategoryId}`, {
            state: {
                category_id: category.id,
                category_name: category.name,
            },
        });
    }
    
    const handleNavigateToCategoryPage = () => {
        navigate(`/category/${category.id}`);
    }

    return (
        <div className={styles.category_box} key={category.id}>
            <div className={styles.category_filed}>
                <div className={styles.plus_btn} 
                    onClick={handleClick}>➕</div>
                <div className={styles.category_name}>{category.name}</div>
                <span>［{subcategories.length}］</span>
            </div>
            <div className='input-field'>
                {showForm && (
                    <>
                        <label>
                            サブカテゴリー名:
                            <input 
                            type="text" 
                            value={subcategoryName} 
                            onChange={(e) => setSubcategoryName(e.target.value)} 
                            autoFocus
                            />
                        </label>
                        <button onClick={handleCreateSubcategory}>Submit</button>
                    </>
                )}
            </div>
            <div>
                {subcategories.map((subcategory: SubcategoryWithQuestionCount) => (
                    <div
                        className={styles.subcategory_name}
                        key={subcategory.id}
                        onClick={() => handleNavigateToSubcategoryPage(subcategory.id)}
                    >
                        ・{subcategory.name} ({subcategory.question_count || 0})
                    </div>
                ))}
            </div>
 
            {/* 6件以上サブカテゴリが存在する場合は、「もっとみる」ボタンを表示させる */}
            {subcategories.length >= 6 && (
                <button 
                onClick={handleNavigateToCategoryPage} 
                className={styles.more_btn}>もっとみる</button>
            )}
        </div>
    );
}

export default CategoryBox;
