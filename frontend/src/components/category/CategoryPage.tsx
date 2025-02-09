import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from "./CategoryPage.module.css"
import { SubcategoryWithQuestionCount } from '../../types/Subcategory';
import { useCategoryPage } from "./hooks/useCategoryPage";
import { useState }  from "react";
// import { handleNavigateToCategoryPage, handleNavigateToSubcategoryPage } from '../../utils/navigate_function'

const CategoryPage = () => {
    const { category_id } = useParams<{ category_id: string }>();
    const [subcategoryName, setSubcategoryName] = useState<string>("");
    
    // category_idをstring型からnumber型に変換
    const categoryId = category_id ? parseInt(category_id, 10) : 0;
    const { category, subcategories, addSubcategory } = useCategoryPage(categoryId);
    const navigate = useNavigate();

    const handleNavigateToSubcategoryPage = (subcategory_id: number) => {
        navigate(`/subcategory/${subcategory_id}`, { 
            state: category
        });
    };

    const handleAddSubcategory = async () => {
        if (!subcategoryName.trim()) {
            alert('サブカテゴリー名を入力してください');
            return
        }

        const response = await fetch('http://localhost:8000/subcategories/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: subcategoryName, category_id: categoryId }),
        });

        if (!response.ok) {
            throw new Error('Failed to create subcategory');
        }

        const data = await response.json() as SubcategoryWithQuestionCount;
        console.log(subcategories.length)

        if (subcategories.length < 6) {
            console.log(9879)
            addSubcategory(data);
        }
        setSubcategoryName("");
    }

    return (
        <div>
            <h2>{category?.name}</h2>
            <h1>ここに検索ボックスを設置</h1>
            {subcategories.map((subcategory: SubcategoryWithQuestionCount) => (
                <div className={styles.subcategory_name} key={subcategory.id} onClick={() => handleNavigateToSubcategoryPage(subcategory.id)}>
                    ・{subcategory.name}
                    <span>【{subcategory.question_count}】</span>
                </div>
                
            ))}

            <label className={styles.inputField}>
                サブカテゴリー名:
                <input 
                type="text" 
                value={subcategoryName} 
                onChange={(e) => setSubcategoryName(e.target.value)} 
                autoFocus
                />
            </label>
            <button className={styles.submitBtn} onClick={handleAddSubcategory}>Submit</button>
        </div>
    )
}

export default CategoryPage