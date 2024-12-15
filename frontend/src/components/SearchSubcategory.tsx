import React, { useState } from 'react'
import styles from "./Home.module.css"

const SearchSubcategory = () => {
    const [searchWord, setSearchWord] = useState<string>("");
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    };

  return (
    <div className={styles.search_container}>
        <input type="text" className={styles.search_box}value={searchWord} onChange={handleSearch} placeholder="サブカテゴリ検索"/>
    </div>
  )
}

export default SearchSubcategory