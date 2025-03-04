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
    question,
    categoryId
}) => {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [category, setCategory] = useState<Category>();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const subcategoryId = parseInt(value, 10);

        setSelectedSubcategoryIds((prev) =>
            checked
                ? [...prev, subcategoryId] // チェックされた場合、IDを追加
                : prev.filter((id) => id !== subcategoryId) // チェックが外れた場合、IDを削除
        );
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }

    const handleSearchClick = async () => {
        if (searchWord.trim() === "") return;
        const categories_data: Category = await fetchCategoriesBySearchWord(searchWord)

        setCategory(categories_data)
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
                <button onClick={handleSearchClick}>クリック</button>
                <div>{category?.name}</div>
                

            </div>


        </div>
    )
}

export default ChangeCategorySubcategory