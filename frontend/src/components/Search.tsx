import React from 'react';
import styles from './Search.module.css';

interface SearchProps {
    type: 'category' | 'subcategory' | 'question';
    searchCategoryWord?: string;
    searchSubcategoryWord?: string;
    searchQuestionWord?: string;
    setSearchCategoryWord: (word: string) => void;
    setSearchSubcategoryWord: (word: string) => void;
    setSearchQuestionWord: (word: string) => void;
    page: number;
    setPage: (page: number) => void;
}

const Search: React.FC<SearchProps> = ({
    type,
    searchCategoryWord = '',
    searchSubcategoryWord = '',
    searchQuestionWord = '',
    setSearchCategoryWord,
    setSearchSubcategoryWord,
    setSearchQuestionWord,
    setPage,
}) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'category') {
            setSearchSubcategoryWord('');
            setSearchQuestionWord('');
            setSearchCategoryWord(e.target.value);
        } else if (type === 'subcategory') {
            setSearchCategoryWord('');
            setSearchQuestionWord('');
            setSearchSubcategoryWord(e.target.value);
        } else {
            setSearchCategoryWord('');
            setSearchSubcategoryWord('');
            setSearchQuestionWord(e.target.value);
        }
        setPage(1);
    };

    return (
        <div className={styles.search_section}>
          <div className={styles.search_container}>
            <input
              type="text"
              className={styles.search_box}
              value={
                type === 'category'
                  ? searchCategoryWord
                  : type === 'subcategory'
                  ? searchSubcategoryWord
                  : searchQuestionWord
              }
              onChange={handleSearch}
              placeholder={`${
                type === 'category'
                  ? 'カテゴリ'
                  : type === 'subcategory'
                  ? 'サブカテゴリ'
                  : '質問'
              }検索`}
            />
          </div>
        </div>
    );
};

export default Search;