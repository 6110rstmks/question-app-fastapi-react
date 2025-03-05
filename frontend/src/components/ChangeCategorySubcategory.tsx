import React, { useEffect, useState } from 'react'
import { Category } from '../types/Category'
import { Question } from '../types/Question'
import { Subcategory } from '../types/Subcategory'
import { SubcategoryWithQuestionCount } from '../types/Subcategory'
import { SubcategoryQuestion } from '../types/SubcategoryQuestion'
import { fetchCategoriesBySearchWord } from '../api/CategoryAPI'
import { fetchSubcategoriesByCategoryId, fetchSubcategoriesByQuestionId } from '../api/SubcategoryAPI'
import { fetchSubcategoriesQuestionsByQuestionId } from '../api/SubcategoryQuestionAPI'
import styles from './ChangeCategorySubcategoryModal.module.css'

interface ChangeCategorySubcategoryProps {
    setModalIsOpen: (isOpen: boolean) => void;
    setSubcategoriesRelatedToQuestion: (subcategories: SubcategoryWithQuestionCount[]) => void;
    categoryName: string;
    question?: Question;
    categoryId: number;
}

interface OriginalData {
    subcategory_id: number;
    question_id: number;
}

const ChangeCategorySubcategory: React.FC<ChangeCategorySubcategoryProps> = ({
    setModalIsOpen,
    setSubcategoriesRelatedToQuestion,
    categoryName,
    question,
    categoryId
}) => {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const subcategoryId = parseInt(value, 10);

        setSelectedSubcategoryIds((prev) =>
            checked
                ? [...prev, subcategoryId] // チェックされた場合、IDを追加
                : prev.filter((id) => id !== subcategoryId) // チェックが外れた場合、IDを削除
        );
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }



    const handleCategoryNameClick = async (categoryId: number) => {
        const data = await fetchSubcategoriesByCategoryId(categoryId);
        console.log(data)
        setSubcategories(data)

    }


    useEffect(() => {
        (async () => {
            const subcategories_data: Subcategory[] = await fetchSubcategoriesByCategoryId(categoryId);
            setSubcategories(subcategories_data)
            const data2 = await fetchSubcategoriesQuestionsByQuestionId(question!.id)
            const transformedData: SubcategoryQuestion[] = data2.map(({ subcategory_id, question_id }: OriginalData) => ({
                subcategoryId: subcategory_id,
                questionId: question_id
            }));
        
            setSelectedSubcategoryIds(transformedData.map((subcategory_question: SubcategoryQuestion ) => subcategory_question.subcategoryId));

        })();
      }, [categoryId]);

    useEffect(() => {
        const loadCategories = async () => {
            if (!searchWord.trim()) return; // 空の場合はfetchしない
            const categories_data: Category[] = await fetchCategoriesBySearchWord(searchWord)
            const filteredCategories = categories_data.filter(category => category.name !== categoryName);
            setCategories(filteredCategories);
        }
        loadCategories();
    }, [searchWord]);

    const handleChangeBelongingToSubcategory = async () => {
        // チェックボックスが全て外れている場合、警告
        if (selectedSubcategoryIds.length === 0) {
            alert('サブカテゴリを選択してください');
            return;
        }

        const response = await fetch(`http://localhost:8000/questions/change_belongs_to_subcategoryId`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subcategory_ids: selectedSubcategoryIds,
                question_id: question?.id
            })
        });

        if (!response.ok) {
            alert('Failed to update the question.');
            return;
        }

        alert('所属するサブカテゴリが変更されました。')
        setModalIsOpen(false);
        
        const data = await fetchSubcategoriesByQuestionId(question!.id);
        setSubcategoriesRelatedToQuestion(data);
    }

    return (
        <div className={styles.modalContainer}>
            <div>
                <div>{categoryName}</div>
                {/* チェックボックスでサブカテゴリ一覧を表示する */}
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
                <button onClick={handleChangeBelongingToSubcategory}>Change</button>
            </div>

            <div>
                <label htmlFor="">カテゴリ名を検索する</label>
                <input 
                    type="text"
                    onChange={handleSearch}
                     />
                {/* <button onClick={handleSearchClick}>クリック</button> */}
                <div className={styles.category_display}>
                    {/* {category?.name} */}
                    {categories?.map((category) => (
                        <div key={category.id} onClick={() => handleCategoryNameClick(category.id)}>
                            <div>{category.name}</div>
                            {/* <div onClick={() => handleCategoryNameClick(category.id)}>{category.name}</div> */}
                        </div>
                    ))}
                </div>
                

            </div>


        </div>
    )
}

export default ChangeCategorySubcategory