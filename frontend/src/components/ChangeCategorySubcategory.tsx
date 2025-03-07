import React from 'react'
import { Subcategory, SubcategoryWithQuestionCount } from '../types/Subcategory'
import { Question } from '../types/Question'

import styles from './ChangeCategorySubcategoryModal.module.css'
import useChangeCategorySubcategoryModal from './useChangeCategorySubcategoryModal'

interface ChangeCategorySubcategoryProps {
    categoryId: number;
    defaultCategoryName: string;
    question?: Question;
    setModalIsOpen: (isOpen: boolean) => void;
    setSubcategoriesRelatedToQuestion: (subcategories: Subcategory[]) => void;
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
        subcategories,
        selectedSubcategoryIds,
        handleCheckboxChange,
        handleClickCategoryName,
        handleSearch,
        handleChangeBelongingToSubcategory,
    } = useChangeCategorySubcategoryModal(
        categoryId, 
        defaultCategoryName, 
        question ?? { id: 0, problem: "", answer: [], memo: "", is_correct: false, answer_count: 0},  // デフォルト値を設定
        setModalIsOpen, 
        setSubcategoriesRelatedToQuestion
    );

    return (
        <div className={styles.modalContainer}>
            <div>
                <label htmlFor="">カテゴリ名を検索する</label>
                <input 
                    type="text"
                    onChange={handleSearch}
                    value={searchWord}
                     />
                {/* <button onClick={handleSearchClick}>クリック</button> */}
                <div className={styles.category_display}>
                    {categories?.map((category) => (
                        <div key={category.id} onClick={() => handleClickCategoryName(category)}>
                            <div className={styles.category_individual}>{category.name}</div>
                            {/* <div onClick={() => handleCategoryNameClick(category.id)}>{category.name}</div> */}
                        </div>
                    ))}
                </div>

                <p>現在の所属カテゴリ、サブカテゴリ</p>
                <div>
                    {linkedSubcategories?.map((linkedSubcategory) => (
                        <div key={linkedSubcategory.id}>
                            {defaultCategoryName}
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
                        {subcategories.map((subcategory) => (
                            <div key={subcategory.id}>
                                <input
                                    type="checkbox"
                                    name="subcategory"
                                    value={subcategory.id}
                                    checked={selectedSubcategoryIds.includes(subcategory.id)} // 初期チェック状態
                                    onChange={handleCheckboxChange}
                                />
                                {subcategory.name}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleChangeBelongingToSubcategory}>Change</button>
            </div>
                    
        </div>


    )
}

export default ChangeCategorySubcategory