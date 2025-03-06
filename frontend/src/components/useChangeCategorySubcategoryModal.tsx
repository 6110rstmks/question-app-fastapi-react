import React, { useState, useEffect } from 'react';
import { Category } from '../types/Category'
import { Subcategory, SubcategoryWithQuestionCount } from '../types/Subcategory'
import { Question } from '../types/Question'
import { SubcategoryQuestion } from '../types/SubcategoryQuestion'
import { fetchCategory } from "../api/CategoryAPI";
import { fetchCategoriesBySearchWord } from '../api/CategoryAPI'
import { fetchSubcategory, fetchSubcategoriesByCategoryId, fetchSubcategoriesByQuestionId } from '../api/SubcategoryAPI'
import { fetchSubcategoriesQuestionsByQuestionId } from '../api/SubcategoryQuestionAPI'


interface OriginalData {
    subcategory_id: number;
    question_id: number;
}

export const useCategoryPage = (
    categoryName: string,
    categoryId: number,
    question: Question, 
    setModalIsOpen: (isOpen: boolean) => void,
    setSubcategoriesRelatedToQuestion: (subcategories: SubcategoryWithQuestionCount[]) => void
) => {
    const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);
    const [searchWord, setSearchWord] = useState<string>("");
    const [searchFlg, setSearchFlg] = useState<boolean>(false);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categories, setCategories] = useState<Category[]>();


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
    return { 
        searchWord,
        searchFlg,
        categories,
        linkedCategory,
        linkedSubcategories,
        subcategories,
        selectedSubcategoryIds,
        handleCheckboxChange,
        handleCategoryNameClick,
        handleSearch,
        handleChangeBelongingToSubcategory
    };
};

export default useCategoryPage;