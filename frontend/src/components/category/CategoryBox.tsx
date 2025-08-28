import React, { useState } from 'react'
import { useNavigate } from "react-router"
import styles from "./CategoryBox.module.css"
import type { Category } from "../../types/Category"
import type { SubcategoryWithQuestionCount } from "../../types/Subcategory"
import { useCategoryBox } from "./hooks/useCategoryBox"
import { 
    handleNavigateToCategoryPage, 
    handleNavigateToSubcategoryPage 
} from '../../utils/navigate_function'
// import { TiPinOutline, TiPin } from "react-icons/ti";

interface CategoryBoxProps {
    category: Category,
    searchSubcategoryWord: string,
    searchQuestionWord: string,
    searchAnswerWord: string
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    category,
    searchSubcategoryWord,
    searchQuestionWord,
    searchAnswerWord
}) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [isPinned, setIsPinned] = useState<boolean>(false)

    const { 
        subcategoriesWithQuestionCount,
        inputSubcategoryName,
        setInputSubcategoryName,
        handleAddSubcategory,
        categoryBoxRef
    } = useCategoryBox({
        categoryId: category.id,
        showForm,
        setShowForm,
        searchSubcategoryWord,
        searchQuestionWord,
        searchAnswerWord
    })

    const navigate = useNavigate()

    return (
        <div className={styles.categoryBox} key={category.id} ref={categoryBoxRef}>
            <div className={styles.categoryFiled}>
                <div onClick={() => setIsPinned(!isPinned)}>
                    {/* {isPinned ? <TiPin /> : <TiPinOutline />} */}
                </div>
                <div 
                    className={styles.categoryName}
                    onClick={() => handleNavigateToCategoryPage(navigate, category)}
                    >{category.name}
                </div>
                <span>［{subcategoriesWithQuestionCount.length}］</span>
                <div className={styles.plusBtn} 
                    onClick={() => setShowForm(!showForm)}>➕
                </div>
            </div>
            <div className={styles.inputField}>
                {showForm && (
                    <>
                        <label className={styles.inputField}>
                            サブカテゴリー名:
                            <input 
                            type="text" 
                            value={inputSubcategoryName} 
                            onChange={(e) => setInputSubcategoryName(e.target.value)} 
                            autoFocus
                            />
                        </label>
                        <button className={styles.submitBtn} onClick={handleAddSubcategory}>Submit</button>
                    </>
                )}
            </div>
            <div>
                {subcategoriesWithQuestionCount.map((subcategory: SubcategoryWithQuestionCount, index) => (
                    <div key={index}>
                        <div
                            className={styles.subcategoryName}
                            onClick={() => handleNavigateToSubcategoryPage(navigate, category, subcategory.id)}
                        >
                            {/* {subcategory.name} ({subcategory.questionCount || 0}) */}
                            {subcategory.name} ({subcategory.question_count || 0})
                        </div>
                        <div className={styles.dottedBorder}></div>
                    </div>
                ))}
            </div>
 
            {/* 6件以上サブカテゴリが存在する場合は、「もっとみる」ボタンを表示させる */}
            {subcategoriesWithQuestionCount.length >= 4 && (
                <button 
                onClick={() => handleNavigateToCategoryPage(navigate, category)} 
                className={styles.moreBtn}>See More</button>
            )}
        </div>
    );
}

export default CategoryBox;
