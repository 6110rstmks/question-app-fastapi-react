import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import styles from "./CategoryBox.module.css"
import { Category } from "../../types/Category"
import { SubcategoryWithQuestionCount } from "../../types/Subcategory"
import { useCategoryBox } from "./hooks/useCategoryBox"
import { handleNavigateToCategoryPage, handleNavigateToSubcategoryPage } from '../../utils/navigate_function'
interface CategoryBoxProps {
    category: Category,
    searchSubcategoryWord: string,
    searchQuestionWord: string,
    searchAnswerWord: string
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ category, searchSubcategoryWord, searchQuestionWord, searchAnswerWord }) => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const { subcategories, subcategoryName, setSubcategoryName, handleAddSubcategory, categoryBoxRef } = useCategoryBox(category.id, showForm, setShowForm, searchSubcategoryWord, searchQuestionWord, searchAnswerWord);
    const navigate = useNavigate();

    return (
        <div className={styles.categoryBox} key={category.id} ref={categoryBoxRef}>
            <div className={styles.categoryFiled}>
                <div className={styles.plusBtn} 
                    onClick={() => setShowForm(!showForm)}>➕</div>
                <div className={styles.categoryName}>{category.name}</div>
                <span>［{subcategories.length}］</span>
            </div>
            <div className={styles.inputField}>
                {showForm && (
                    <>
                        <label className={styles.inputField}>
                            サブカテゴリー名:
                            <input 
                            type="text" 
                            value={subcategoryName} 
                            onChange={(e) => setSubcategoryName(e.target.value)} 
                            autoFocus
                            />
                        </label>
                        <button className={styles.submitBtn} onClick={handleAddSubcategory}>Submit</button>
                    </>
                )}
            </div>
            <div>
                {subcategories.map((subcategory: SubcategoryWithQuestionCount, index) => (
                    <div key={index}>
                        <div
                            className={styles.subcategoryName}
                            // key={subcategory.id}
                            onClick={() => handleNavigateToSubcategoryPage(navigate, category, subcategory.id)}
                        >
                            {subcategory.name} ({subcategory.question_count || 0})
                        </div>
                        <div className={styles.dottedBorder}></div>
                    </div>
                    
                ))}
            </div>
 
            {/* 6件以上サブカテゴリが存在する場合は、「もっとみる」ボタンを表示させる */}
            {subcategories.length >= 6 && (
                <button 
                onClick={() => handleNavigateToCategoryPage(navigate, category)} 
                className={styles.moreBtn}>See More</button>
            )}
        </div>
    );
}

export default CategoryBox;
