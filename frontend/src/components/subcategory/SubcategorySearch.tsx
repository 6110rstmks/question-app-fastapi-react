import React from 'react'
import styles from './SubcategorySearch.module.css'

interface SubcategorySearchProps {
    searchCategoryWord: string;
    setSearchCategoryWord: (searchWord: string) => void;
    searchSubcategoryWord: string;
    setSearchSubcategoryWord: (searchSubcategoryWord: string) => void;
    page: number;
    setPage: (page: number) => void;
}

const SubcategorySearch: React.FC<SubcategorySearchProps> = ( { searchCategoryWord, setSearchCategoryWord, searchSubcategoryWord, setSearchSubcategoryWord,setPage }) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(29827)
        setSearchCategoryWord('');
        setSearchSubcategoryWord(e.target.value);
        setPage(1); // 新しい検索時にページをリセット
    };

  return (
    <div>
        <div className={styles.search_section}>
            <div className={styles.search_container}>
                <input 
                type="text" 
                className={styles.search_box}
                value={searchSubcategoryWord} 
                onChange={handleSearch} 
                placeholder="サブカテゴリ検索"/>
            </div>
        </div>
    </div>
  )
}

export default SubcategorySearch