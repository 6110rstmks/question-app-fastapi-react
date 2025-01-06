import React from 'react'
import styles from './CategorySearch.module.css'

interface CategorySearchProps {
    searchCategoryWord: string;
    setSearchCategoryWord: (searchWord: string) => void;
    searchSubcategoryWord: string;
    setSearchSubcategoryWord: (searchSubcategoryWord: string) => void;
    page: number;
    setPage: (page: number) => void;
}

const CategorySearch: React.FC<CategorySearchProps> = ( { searchCategoryWord, setSearchCategoryWord, searchSubcategoryWord, setSearchSubcategoryWord,setPage }) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchSubcategoryWord('');
        setSearchCategoryWord(e.target.value);
        setPage(1); // 新しい検索時にページをリセット
    };

  return (
    <div>
        <div className={styles.search_section}>
            <div className={styles.search_container}>
                <input type="text" className={styles.search_box}
                    value={searchCategoryWord} 
                    onChange={handleSearch} 
                placeholder="カテゴリ検索"/>
            </div>
        </div>
    </div>
  )
}

export default CategorySearch