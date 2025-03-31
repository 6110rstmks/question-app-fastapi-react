import { useParams } from 'react-router';
import { useNavigate } from "react-router"
import styles from "./CategoryPage.module.css"
import { SubcategoryWithQuestionCount } from '../../types/Subcategory';
import { useCategoryPage } from "./hooks/useCategoryPage";
import { handleNavigateToSubcategoryPage } from '../../utils/navigate_function'

const CategoryPage: React.FC = () => {
    const { categoryId: categoryIdStr } = useParams<{ categoryId: string }>();   
    const categoryId = Number(categoryIdStr)
    const { 
        category,
        subcategories,
        subcategoryName,
        setSubcategoryName,
        searchWord,
        handleAddSubcategory,
        handleSearch
    } = useCategoryPage(categoryId)

    const navigate = useNavigate()

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
                    />
                </label>
                <button 
                    className={styles.submitBtn}
                    onClick={handleAddSubcategory}
                >Submit</button>
            </div>

            <div className={styles.search_section}>
                <div className={styles.search_container}>
                    <input
                    type="text"
                    className={styles.search_box}
                    value={searchWord}
                    onChange={handleSearch}
                    placeholder="Search"
                    autoFocus
                    />
                </div>
            </div>
            <div>        
                {subcategories.map((subcategory: SubcategoryWithQuestionCount) => (
                    <div className={styles.subcategory_name} 
                        key={subcategory.id} 
                        onClick={() => category && handleNavigateToSubcategoryPage(navigate, category, subcategory.id)}>
                        ・{subcategory.name}
                        <span>【{subcategory.question_count}】</span>
                    </div>
                    
                ))}
            </div>

        </div>
    )
}

export default CategoryPage