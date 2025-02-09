import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import styles from "./CategoryPage.module.css"
import { SubcategoryWithQuestionCount } from '../../types/Subcategory';
import { useCategoryPage } from "./hooks/useCategoryPage";
import { handleNavigateToSubcategoryPage } from '../../utils/navigate_function'

const CategoryPage = () => {
    const { category_id } = useParams<{ category_id: string }>();   
    // category_idをstring型からnumber型に変換
    const categoryId = category_id ? parseInt(category_id, 10) : 0;
    const { category, subcategories, subcategoryName, setSubcategoryName, searchWord, handleAddSubcategory, handleSearch } = useCategoryPage(categoryId);
    const navigate = useNavigate();

    return (
        <div>
            <h2>{category?.name}</h2>
            <div>
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

            <div className={styles.search_section}>
                <div className={styles.search_container}>
                    <input
                    type="text"
                    className={styles.search_box}
                    value={searchWord}
                    onChange={handleSearch}
                    placeholder="Search"
                    />
                </div>
            </div>
            <div>        
                {subcategories.map((subcategory: SubcategoryWithQuestionCount) => (
                    <div className={styles.subcategory_name} key={subcategory.id} onClick={() => category && handleNavigateToSubcategoryPage(navigate, category, subcategory.id)}>
                        ・{subcategory.name}
                        <span>【{subcategory.question_count}】</span>
                    </div>
                    
                ))}
            </div>

        </div>
    )
}

export default CategoryPage