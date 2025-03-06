import React, { useEffect, useState } from 'react'
import { Category } from '../types/Category'
import { Question } from '../types/Question'
import { Subcategory, SubcategoryWithQuestionCount } from '../types/Subcategory'
import { SubcategoryQuestion } from '../types/SubcategoryQuestion'
import { fetchCategoriesBySearchWord } from '../api/CategoryAPI'
import { fetchSubcategory, fetchSubcategoriesByCategoryId, fetchSubcategoriesByQuestionId } from '../api/SubcategoryAPI'
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
    const [searchFlg, setSearchFlg] = useState<boolean>(false);

    // Questionが所属しているCategory
    const [linkedCategory, setLinkedCategory] = useState<Category>();
    const [linkedSubcategories, setLinkedSubcategories] = useState<Subcategory[]>()

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const subcategoryId = parseInt(value, 10);

        setSelectedSubcategoryIds((prev) =>
            checked
                ? [...prev, subcategoryId] // チェックされた場合、IDを追加
                : prev.filter((id) => id !== subcategoryId) // チェックが外れた場合、IDを削除
        );
    };

    // 検索ボックスでワードを入力している時の処理
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }


    // 検索結果で表示されたcategoryの一つをクリックした時の処理
    const handleCategoryNameClick = async (category: Category) => {
        setSearchWord(category.name)
        const data = await fetchSubcategoriesByCategoryId(category.id);
        setSearchFlg(true);
        setLinkedCategory(category);
        setSubcategories(data)
    }


    useEffect(() => {
        (async () => {
            const subcategoriesData: Subcategory[] = await fetchSubcategoriesByCategoryId(categoryId);
            setSubcategories(subcategoriesData)
            const data2 = await fetchSubcategoriesQuestionsByQuestionId(question!.id)
            const transformedData: SubcategoryQuestion[] = data2.map(({ subcategory_id, question_id }: OriginalData) => ({
                subcategoryId: subcategory_id,
                questionId: question_id
            }));

            const linkedSubcategories = []

            for (const subcategoryquestion of transformedData) {
                console.log(`Subcategory ID: ${subcategoryquestion.subcategoryId}, Question ID: ${subcategoryquestion.questionId}`);
            
                const data3 = await fetchSubcategory(subcategoryquestion.subcategoryId);
                linkedSubcategories.push(data3);
            }
            setLinkedSubcategories(linkedSubcategories)
            setSelectedSubcategoryIds(transformedData.map((subcategory_question: SubcategoryQuestion ) => subcategory_question.subcategoryId));

        })();
      }, [categoryId]);

    useEffect(() => {
        const loadCategories = async () => {
            if (!searchWord.trim()) return; // 空の場合はfetchしない
            const categories_data: Category[] = await fetchCategoriesBySearchWord(searchWord)

            // 初回検索でcategoryNameが表示されている時、categoryNameをsearch結果に表示させないようにする。表示結果に表示されたらだぶっているため。
            if (!searchFlg) {
                const filteredCategories = categories_data.filter(category => category.name !== categoryName);
                setCategories(filteredCategories);
            } else {
                setCategories(categories_data);
            }
        }
        loadCategories();
    }, [searchWord]);

    const handleChangeBelongingToSubcategory = async () => {
        // チェックボックスが全て外れている場合、警告
        if (selectedSubcategoryIds.length === 0) {
            alert('サブカテゴリを選択してください');
            return;
        }

        console.log(selectedSubcategoryIds)

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
                <label htmlFor="">カテゴリ名を検索する</label>
                <input 
                    type="text"
                    onChange={handleSearch}
                    value={searchWord}
                     />
                {/* <button onClick={handleSearchClick}>クリック</button> */}
                <div className={styles.category_display}>
                    {categories?.map((category) => (
                        <div key={category.id} onClick={() => handleCategoryNameClick(category)}>
                            <div className={styles.category_individual}>{category.name}</div>
                            {/* <div onClick={() => handleCategoryNameClick(category.id)}>{category.name}</div> */}
                        </div>
                    ))}
                </div>

                <p>現在の所属カテゴリ、サブカテゴリ</p>

                <div>{categoryName}
                <span>＞
                    {linkedSubcategories?.map((linkedSubcategory) => (
                    <span key={linkedSubcategory.id}>{linkedSubcategory.name}</span>
                    ))}
                </span>
                </div>
            </div>
            <div className={styles.subcategory_display}>
                <div>                    
                    {searchFlg ? linkedCategory?.name : categoryName}
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