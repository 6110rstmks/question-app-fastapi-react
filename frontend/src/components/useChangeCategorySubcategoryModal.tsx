import React, { useState, useEffect } from 'react';
import { Category } from '../types/Category'
import { Subcategory  } from '../types/Subcategory'
import { Question } from '../types/Question'
import { SubcategoryQuestion } from '../types/SubcategoryQuestion'
import { CategoryQuestion } from '../types/CategoryQuestion'
import { fetchCategoriesBySearchWord } from '../api/CategoryAPI'
import { fetchSubcategory, fetchSubcategoriesByCategoryId, fetchSubcategoriesByQuestionId } from '../api/SubcategoryAPI'
import { fetchSubcategoriesQuestionsByQuestionId } from '../api/SubcategoryQuestionAPI'
import { fetchCategoryQuestionByQuestionId } from '../api/CategoryQuestionAPI'

interface OriginalData {
    subcategory_id: number;
    question_id: number;
}

interface OriginalData2 {
    category_id: number;
    question_id: number;
}

export const useCategoryPage = (
    categoryId: number,
    defaultCategoryName: string,
    question: Question, 
    setModalIsOpen: (isOpen: boolean) => void,
    setSubcategoriesRelatedToQuestion: (subcategories: Subcategory[]) => void
) => {


    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([categoryId]);
    const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);


    const [searchWord, setSearchWord] = useState<string>("");

    // falseであればQuestionが現在所属しているCategoryNameが表示される。
    // trueであれば検索結果でクリックしたCategoryNameが表示される。
    const [searchFlg, setSearchFlg] = useState<boolean>(false);

    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categories, setCategories] = useState<Category[]>();


    // searchFlgがtrueの時に表示されるCategoryName
    const [displayedCategoryName, setDisplayedCategoryName] = useState<string>("");

    // 初期でチェックされているSubcategoryと追加でチェックされたSubcateogryの情報
    const [linkedSubcategories, setLinkedSubcategories] = useState<Subcategory[]>()

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const subcategoryId = parseInt(value, 10);

        const subcategoryData = await fetchSubcategory(subcategoryId)
        const categoryId = parseInt(subcategoryData.category_id, 10)


        setSelectedCategoryIds((prev) => 
            checked
                ? [...prev, categoryId] // チェックされた場合、新しい配列を返す
                : prev.filter((id) => id !== categoryId) // チェックが外れた場合、新しい配列を返す
        )


        setSelectedSubcategoryIds((prev) =>
            checked
                ? [...prev, subcategoryId] // チェックされた場合、IDを追加
                : prev.filter((id) => id !== subcategoryId) // チェックが外れた場合、IDを削除
        )
    }

    // 検索ボックスでワードを入力している時の処理
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }


    // 検索結果で表示されたcategoryの一つをクリックした時の処理
    const handleClickCategoryName = async (category: Category) => {
        setSearchWord(category.name)
        const data = await fetchSubcategoriesByCategoryId(category.id);
        setSearchFlg(true);
        setDisplayedCategoryName(category.name);
        setSubcategories(data)
    }


    useEffect(() => {
        (async () => {
            const subcategoriesData: Subcategory[] = await fetchSubcategoriesByCategoryId(categoryId);
            setSubcategories(subcategoriesData)

            const subcategoriesquestionsData = await fetchSubcategoriesQuestionsByQuestionId(question!.id)
            const transformedSubcategoryQuestionData: SubcategoryQuestion[] = subcategoriesquestionsData.map(({ subcategory_id, question_id }: OriginalData) => ({
                subcategoryId: subcategory_id,
                questionId: question_id
            }));

            const categoriesQuestionsData = await fetchCategoryQuestionByQuestionId(question!.id)
            const transformedCategoryQuestionData: CategoryQuestion[] = categoriesQuestionsData.map(({ category_id, question_id }: OriginalData2) => ({
                categoryId: category_id,
                questionId: question_id
            }));

            const linkedSubcategories = []

            for (const subcategoryquestion of transformedSubcategoryQuestionData) {            
                const subcategoriesData = await fetchSubcategory(subcategoryquestion.subcategoryId);
                linkedSubcategories.push(subcategoriesData);
            }
            setLinkedSubcategories(linkedSubcategories)
            setSelectedSubcategoryIds(transformedSubcategoryQuestionData.map((subcategory_question: SubcategoryQuestion ) => subcategory_question.subcategoryId));

        })();
      }, [categoryId]);

    useEffect(() => {
        const loadCategories = async () => {
            if (!searchWord.trim()) return; // 空の場合はfetchしない
            const categories_data: Category[] = await fetchCategoriesBySearchWord(searchWord)

            // 初回検索でcategoryNameが表示されている時、categoryNameをsearch結果に表示させないようにする。表示結果に表示されたらだぶっているため。
            if (!searchFlg) {
                const filteredCategories = categories_data.filter(category => category.name !== defaultCategoryName);
                setCategories(filteredCategories);
            } else {
                setCategories(categories_data);
            }
        }
        loadCategories();
    }, [searchWord]);

    // 変更を確定するボタンをクリックした時の処理
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
                category_ids: selectedCategoryIds,
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
        displayedCategoryName,
        linkedSubcategories,
        subcategories,
        selectedSubcategoryIds,
        handleCheckboxChange,
        handleClickCategoryName,
        handleSearch,
        handleChangeBelongingToSubcategory
    };
};

export default useCategoryPage;