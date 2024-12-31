import React from 'react'
import styles from './CategorySearch.module.css'

interface CategorySearchProps {
    searchWord: string;
    setSearchWord: (searchWord: string) => void;
    page: number;
    setPage: (page: number) => void;
}

const CategorySearch: React.FC<CategorySearchProps> = ( { searchWord, setSearchWord, setPage }) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
        setPage(1); // 新しい検索時にページをリセット
    };

  return (
    <div>
        <div className={styles.search_section}>
            <div className={styles.search_container}>
                <input type="text" className={styles.search_box}value={searchWord} onChange={handleSearch} placeholder="カテゴリ検索"/>
            </div>
            <div className={styles.search_container}>
                <input type="text" className={styles.search_box}value={searchWord} onChange={handleSearch} placeholder="サブカテゴリ検索"/>
            </div>
        </div>
    </div>
  )
}

export default CategorySearch