import React, { useEffect } from 'react'
import { Question } from '../types/Question'
import { Subcategory } from '../types/Subcategory'
import { useState } from 'react'
import { fetchSubcategoriesByCategoryId } from '../api/SubcategoryAPI'
import { SubcategoryWithQuestionCount } from '../types/Subcategory'
interface ChangeCategorySubcategoryProps {
  setModalIsOpen: (isOpen: boolean) => void;
  subcategoryName: string
  question?: Question;
  setQuestion: (question: Question) => void;
  categoryId: number;
}

const ChangeCategorySubcategory: React.FC<ChangeCategorySubcategoryProps> = ({setModalIsOpen, subcategoryName, question, setQuestion, categoryId}) => {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const subcategoryId = parseInt(value, 10);

        setSelectedSubcategories((prev) =>
            checked
                ? [...prev, subcategoryId] // チェックされた場合、IDを追加
                : prev.filter((id) => id !== subcategoryId) // チェックが外れた場合、IDを削除
        );
    };

    useEffect(() => {
        (async () => {
            const data = await fetchSubcategoriesByCategoryId(categoryId);
            setSubcategories(data);
        
            // 初期表示で`subcategoryName`が一致するものをチェック
            const matchedSubcategory = data.find(
                (subcategory: Subcategory) => subcategory.name === subcategoryName
            );
            if (matchedSubcategory) {
                setSelectedSubcategories([matchedSubcategory.id]);
            }
        })();
      }, [categoryId, ]);

    const handleChangeSubcategory = () => {

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
                        checked={selectedSubcategories.includes(subcategory.id)} // 初期チェック状態
                        onChange={handleCheckboxChange}
                        />
                        {subcategory.name}
                    </div>
                ))}
    
            </div>
            <button onClick={handleChangeSubcategory}>変更する</button>
        </div>
    )
}

export default ChangeCategorySubcategory