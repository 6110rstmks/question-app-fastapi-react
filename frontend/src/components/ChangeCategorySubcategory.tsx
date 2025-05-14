import React from 'react'
import { SubcategoryWithCategoryName } from '../types/Subcategory'
import { Question } from '../types/Question'
import { SolutionStatus } from '../types/SolutionStatus'

import styles from './ChangeCategorySubcategoryModal.module.css'
import useChangeCategorySubcategoryModal from './useChangeCategorySubcategoryModal'

interface ChangeCategorySubcategoryProps {
    categoryId: number;
    defaultCategoryName: string;
    question?: Question;
    setModalIsOpen: (isOpen: boolean) => void;
    setSubcategoriesRelatedToQuestion: (subcategories: SubcategoryWithCategoryName[]) => void;
}


const ChangeCategorySubcategory: React.FC<ChangeCategorySubcategoryProps> = ({
    categoryId,
    defaultCategoryName,
    question,
    setModalIsOpen,
    setSubcategoriesRelatedToQuestion,
}) => {

    const {
        searchWord,
        searchFlg,
        categories,
        displayedCategoryName,
        linkedSubcategories,
        subcategoriesWithCategoryName,
        selectedSubcategoryIds,
        handleCheckboxChange,
        handleClickCategoryName,
        handleSearch,
        handleChangeBelongingToSubcategory,
    } = useChangeCategorySubcategoryModal(
        categoryId, 
        defaultCategoryName, 
        question ?? { 
            id: 0, 
            problem: "", 
            answer: [], 
            memo: "", 
            is_correct: SolutionStatus.Incorrect,  // 修正：`false`ではなく`SolutionStatus.NOT_SOLVED`に変更
            answer_count: 0 
        },  
        setModalIsOpen, 
        setSubcategoriesRelatedToQuestion
    );

    return (
        <div className={styles.modalContainer}>
            <div className={styles.left_container}>
                <div className={styles.search_container}>
                    <label htmlFor="">カテゴリ名を検索する</label>
                    <input 
                        type="text"
                        onChange={handleSearch}
                        value={searchWord}
                        autoFocus
                        />
                    <div className={styles.category_display}>
                        {categories?.map((category) => (
                            <div key={category.id} onClick={() => handleClickCategoryName(category)}>
                                <div className={styles.category_individual}>{category.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <p>現在の所属カテゴリ、サブカテゴリ</p>
                <div>
                    {linkedSubcategories?.map((linkedSubcategory) => (
                        <div key={linkedSubcategory.id}>
                            {/* {defaultCategoryName} */}
                            {linkedSubcategory.category_name}
                            <span>＞</span>
                            <span>{linkedSubcategory.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.subcategory_display}>
                <div>                    
                    {!searchFlg ? defaultCategoryName: displayedCategoryName}
                </div>
                    {/* チェックボックスでサブカテゴリ一覧を表示する */}
                    <div className={styles.subcategory_list}>
                        {subcategoriesWithCategoryName.map((subcategoryWithCategoryName) => (
                            <div key={subcategoryWithCategoryName.id}>
                                <input
                                    type="checkbox"
                                    name="subcategory"
                                    value={JSON.stringify(subcategoryWithCategoryName)} 
                                    checked={selectedSubcategoryIds.includes(subcategoryWithCategoryName.id)} // 初期チェック状態
                                    onChange={handleCheckboxChange}
                                />
                                {subcategoryWithCategoryName.name}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleChangeBelongingToSubcategory}>Change</button>
            </div>
                    
        </div>


    )
}

export default ChangeCategorySubcategory