import React, { useState, useEffect } from 'react';
import { Category } from '../types/Category'
import { Subcategory, SubcategoryWithCategoryName  } from '../types/Subcategory'
import { Question } from '../types/Question'
import { SubcategoryQuestion } from '../types/SubcategoryQuestion'
import { fetchCategoriesBySearchWord } from '../api/CategoryAPI'
import { fetchSubcategoriesWithCategoryNameByQuestionId, fetchSubcategoriesWithCategoryNameByCategoryId, fetchSubcategoryWithCategoryNameById } from '../api/SubcategoryAPI'
import { fetchSubcategoriesQuestionsByQuestionId } from '../api/SubcategoryQuestionAPI'

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
    setSubcategoriesRelatedToQuestion: (subcategories: SubcategoryWithCategoryName[]) => void
) => {


    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([categoryId]);
    const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);


    const [searchWord, setSearchWord] = useState<string>("");

    // falseであればQuestionが現在所属しているCategoryNameが表示される。
    // trueであれば検索結果でクリックしたCategoryNameが表示される。
    const [searchFlg, setSearchFlg] = useState<boolean>(false);

    // 初期はQuestionに紐づくCategoryに所属しているSubcategoriesを表示
    // また検索結果（CategoryName）をクリックした場合、そのCategoryに所属しているSubcategoriesに表示が変わる。
    const [subcategoriesWithCategoryName, setSubcategoriesWithCategoryName] = useState<SubcategoryWithCategoryName[]>([]);

    const [categories, setCategories] = useState<Category[]>();

    // searchFlgがtrueの時に表示されるCategoryName
    const [displayedCategoryName, setDisplayedCategoryName] = useState<string>("");

    // 初期でチェックされているSubcategoryと追加でチェックされたSubcateogryの情報
    const [linkedSubcategories, setLinkedSubcategories] = useState<SubcategoryWithCategoryName[]>()

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const { value, checked } = event.target;
        const parsedValue = JSON.parse(value);

        const subcategoryId = parseInt(parsedValue.id, 10);

        // const subcategoryData = await fetchSubcategory(subcategoryId)
        const categoryId = parseInt(parsedValue.category_id, 10)

        if (checked) {
            setSelectedCategoryIds((prev) => {
                const updated = [...prev, categoryId]
                return updated
            });

        } else if (!checked) {

            // チェックが外れた場合でかつすでに同じカテゴリのサブカテゴリにチェックが入っている場合、何もしない
            setSelectedCategoryIds((prev) => {
                const index = prev.indexOf(categoryId);
                if (index === -1) return prev; // もしcategoryIdがなければそのまま返す
            
                const updated = [...prev];
                updated.splice(index, 1); // 最初に見つかったcategoryIdのみ削除   
                return updated;
            });

        }


        setSelectedSubcategoryIds((prev) =>
            checked
                ? [...prev, subcategoryId] // チェックされた場合、IDを追加
                : prev.filter((id) => id !== subcategoryId) // チェックが外れた場合、IDを削除
        )

        setLinkedSubcategories((prev) =>
            checked
                ? [
                    ...(prev || []), 
                    {
                        ...parsedValue, // 既存の値をそのままコピー
                        categoryId: parsedValue.category_id, // category_id を categoryId に変更
                        categoryName: parsedValue.category_name, // category_name を categoryName に変更
                        // category_id と category_name は削除または更新
                    }
                ]
                : (prev || []).filter((subcategory) => subcategory.id !== subcategoryId) // チェックが外れた場合
        );
    }

    // 検索ボックスでワードを入力している時の処理
    // 部分検索で一致したCategoryNameを表示する。
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }


    // 検索結果で表示されたcategoryの一つをクリックした時の処理
    const handleClickCategoryName = async (category: Category) => {
        setSearchWord(category.name)
        const data: SubcategoryWithCategoryName[] = await fetchSubcategoriesWithCategoryNameByCategoryId(category.id);
        setSearchFlg(true);
        setDisplayedCategoryName(category.name);
        setSubcategoriesWithCategoryName(data)
    }


    useEffect(() => {
        (async () => {
            const subcategoriesData: SubcategoryWithCategoryName[] = await fetchSubcategoriesWithCategoryNameByCategoryId(categoryId);
            setSubcategoriesWithCategoryName(subcategoriesData)

            const subcategoriesquestionsData = await fetchSubcategoriesQuestionsByQuestionId(question!.id)
            const transformedSubcategoryQuestionData: SubcategoryQuestion[] = subcategoriesquestionsData.map(({ subcategory_id, question_id }: OriginalData) => ({
                subcategoryId: subcategory_id,
                questionId: question_id
            }));


            const linkedSubcategories = []

            for (const subcategoryquestion of transformedSubcategoryQuestionData) {            
                const subcategoriesData = await fetchSubcategoryWithCategoryNameById(subcategoryquestion.subcategoryId);
                linkedSubcategories.push(subcategoriesData);
            }

            const updatedSubcategories = linkedSubcategories.map(subcategory => ({
                ...subcategory, // 既存のキーと値を保持
                categoryId: subcategory.category_id, // category_id を categoryId に変更
                categoryName: subcategory.category_name, // category_name を categoryName に変更
                // 元の category_id と category_name を削除
                // 必要なら、元のキーを削除することもできます。
                // 例: delete subcategory.category_id;
            }));
            
            // 必要に応じて、更新した配列を状態にセット
            setLinkedSubcategories(updatedSubcategories);

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

    // カテゴリ・サブカテゴリの変更を確定するボタンをクリックした時の処理
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
        
        const data = await fetchSubcategoriesWithCategoryNameByQuestionId(question!.id);
        setSubcategoriesRelatedToQuestion(data);
    }
    return { 
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
        handleChangeBelongingToSubcategory
    };
};

export default useCategoryPage;