import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from "./CategoryPage.module.css"
import { SubcategoryWithQuestionCount } from '../../types/Subcategory';
import { useCategoryPage } from "./hooks/useCategoryPage";

const CategoryPage = () => {
    const { category_id } = useParams<{ category_id: string }>();
    
    // category_idをstring型からnumber型に変換
    const categoryId = category_id ? parseInt(category_id, 10) : 0;
    const { category, subcategories, addSubcategory } = useCategoryPage(categoryId);
    const navigate = useNavigate();

    const handleNavigateToSubcategoryPage = (subcategory_id: number) => {
        navigate(`/subcategory/${subcategory_id}`, { 
            state: category
        });
    };

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
        </div>
    )
}

export default CategoryPage