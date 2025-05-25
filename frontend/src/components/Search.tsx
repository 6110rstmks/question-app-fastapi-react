import React from 'react';
import styles from './Search.module.css';

interface SearchProps {
    type: 'category' | 'subcategory' | 'question' | 'answer';
    searchCategoryWord?: string;
    searchSubcategoryWord?: string;
    searchQuestionWord?: string;
    searchAnswerWord?: string;
    setSearchCategoryWord: (word: string) => void;
    setSearchSubcategoryWord: (word: string) => void;
    setSearchQuestionWord: (word: string) => void;
    setSearchAnswerWord: (word: string) => void;
    page: number;
    setPage: (page: number) => void;
    autoFocus?: boolean
}

const Search: React.FC<SearchProps> = ({
    type,
    searchCategoryWord = '',
    searchSubcategoryWord = '',
    searchQuestionWord = '',
    searchAnswerWord = '',  
    setSearchCategoryWord,
    setSearchSubcategoryWord,
    setSearchQuestionWord,
    setSearchAnswerWord,
    setPage,
    autoFocus
}) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'category') {
            setSearchCategoryWord(e.target.value);
            setSearchSubcategoryWord('');
            setSearchQuestionWord('');
            setSearchAnswerWord('');
        } else if (type === 'subcategory') {
            setSearchCategoryWord('');
            setSearchSubcategoryWord(e.target.value);
            setSearchQuestionWord('');
            setSearchAnswerWord('');
        } else if (type === 'question') {
            setSearchCategoryWord('');
            setSearchSubcategoryWord('');
            setSearchQuestionWord(e.target.value);
            setSearchAnswerWord('');
        }
        else {
            setSearchCategoryWord('');
            setSearchSubcategoryWord('');
            setSearchQuestionWord('');
            setSearchAnswerWord(e.target.value);
        }
        setPage(1);
    };

    const handleEnter = () => {
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleEnter();
        }
    }

    return (
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input
                type="text"
                className={styles.searchBox}
                value={
                    type === 'category'
                        ? searchCategoryWord
                        : type === 'subcategory'
                        ? searchSubcategoryWord
                        : type === 'question'
                        ? searchQuestionWord
                        : searchAnswerWord
                }
                onChange={handleSearch}
                onKeyDown={handleKeyDown}  // ← Enter検知用
                placeholder={`${
                    type === 'category'
                    ? 'カテゴリ'
                    : type === 'subcategory'
                    ? 'サブカテゴリ'
                    : type === 'question'
                    ? '質問'
                    : '解答'
                }検索`}
                autoFocus={autoFocus}
            />
          </div>
        </div>
    );
};

export default Search;