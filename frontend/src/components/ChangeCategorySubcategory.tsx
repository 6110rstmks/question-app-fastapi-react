import React, { useEffect, useState } from 'react'
import { Question } from '../types/Question'
import { Subcategory } from '../types/Subcategory'
import { SubcategoryWithQuestionCount } from '../types/Subcategory'
import { SubcategoryQuestion } from '../types/SubcategoryQuestion'
import { fetchSubcategoriesByCategoryId, fetchSubcategoriesByQuestionId } from '../api/SubcategoryAPI'
import { fetchSubcategoriesQuestionsByQuestionId } from '../api/SubcategoryQuestionAPI'

interface ChangeCategorySubcategoryProps {
    setModalIsOpen: (isOpen: boolean) => void;
    setSubcategoriesRelatedToQuestion: (subcategories: SubcategoryWithQuestionCount[]) => void;
    question?: Question;
    setQuestion: (question: Question) => void;
    categoryId: number;
}

interface OriginalData {
    subcategory_id: number;
    question_id: number;
}

const ChangeCategorySubcategory: React.FC<ChangeCategorySubcategoryProps> = ({setModalIsOpen, setSubcategoriesRelatedToQuestion, question, setQuestion, categoryId}) => {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>([]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const subcategoryId = parseInt(value, 10);

        setSelectedSubcategoryIds((prev) =>
            checked
                ? [...prev, subcategoryId] // チェックされた場合、IDを追加
                : prev.filter((id) => id !== subcategoryId) // チェックが外れた場合、IDを削除
        );
    };

    useEffect(() => {
        (async () => {
            const subcategories_data: Subcategory[] = await fetchSubcategoriesByCategoryId(categoryId);
            setSubcategories(subcategories_data);

            console.log(subcategories_data)

            const data2 = await fetchSubcategoriesQuestionsByQuestionId(question!.id);
            console.log(data2)

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
        <div>
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
    
            </div>
            <button onClick={handleChangeBelongingToSubcategory}>Change</button>
        </div>
    )
}

export default ChangeCategorySubcategory