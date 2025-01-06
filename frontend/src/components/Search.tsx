import React from 'react';
import styles from './Search.module.css';

interface SearchProps {
  type: 'category' | 'subcategory';
  searchCategoryWord?: string;
  searchSubcategoryWord?: string;
  setSearchCategoryWord: (word: string) => void;
  setSearchSubcategoryWord: (word: string) => void;
  page: number;
  setPage: (page: number) => void;
}

const Search: React.FC<SearchProps> = ({
  type,
  searchCategoryWord = '',
  searchSubcategoryWord = '',
  setSearchCategoryWord,
  setSearchSubcategoryWord,
  setPage,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'category') {
      setSearchSubcategoryWord('');
      setSearchCategoryWord(e.target.value);
    } else {
      setSearchCategoryWord('');
      setSearchSubcategoryWord(e.target.value);
    }
    setPage(1);
  };

  return (
    <div className={styles.search_section}>
      <div className={styles.search_container}>
        <input
          type="text"
          className={styles.search_box}
          value={type === 'category' ? searchCategoryWord : searchSubcategoryWord}
          onChange={handleSearch}
          placeholder={`${type === 'category' ? 'カテゴリ' : 'サブカテゴリ'}検索`}
        />
      </div>
    </div>
  );
};

export default Search;