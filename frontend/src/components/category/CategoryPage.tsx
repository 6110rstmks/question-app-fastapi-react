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
        handleSearch,
        handleSetUnsolvedProblem,
        handleSetTemporaryProblem
    } = useCategoryPage(categoryId)

    const navigate = useNavigate()

    return (
        <div>
            <h2>{category?.name}</h2>
            <button 
                className={styles.displayIncorrectedQuestionBtn}
                onClick={handleSetUnsolvedProblem}
            >
                未正解の問題から出題する。
            </button>
            <button 
                className={styles.displayIncorrectedQuestionBtn}
                onClick={handleSetTemporaryProblem}
            >
                Temporaryの問題から出題する。
            </button>
            {/* <div>
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
            </div> */}
                <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>サブカテゴリーの追加</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="subcategory">
            サブカテゴリー名
          </label>
          <input
            id="subcategory"
            type="text"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            className={styles.input}
            placeholder="新しいサブカテゴリー名を入力"
          />
        </div>
        
        <button
          onClick={handleAddSubcategory}
          className={styles.displayIncorrectedQuestionBtn}
        >
          追加する
        </button>
      </div>
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