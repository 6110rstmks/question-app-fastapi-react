import React from 'react'

interface SearchProps {
    type: 'category' | 'subcategory' | 'question' | 'answer'
    searchCategoryWord?: string
    searchSubcategoryWord?: string
    searchQuestionWord?: string
    searchAnswerWord?: string
    setSearchCategoryWord: (word: string) => void
    setSearchSubcategoryWord: (word: string) => void
    // setSearchQuestionWord: (word: string) => void
    // setSearchAnswerWord: (word: string) => void
    page: number
    setPage: (page: number) => void
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
    // setSearchQuestionWord,
    // setSearchAnswerWord,
    setPage,
    autoFocus
}) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'category') {
            setSearchCategoryWord(e.target.value)
            setSearchSubcategoryWord('')
            // setSearchQuestionWord('')
            // setSearchAnswerWord('')
        } else if (type === 'subcategory') {
            setSearchCategoryWord('')
            setSearchSubcategoryWord(e.target.value)
            // setSearchQuestionWord('')
            // setSearchAnswerWord('')
        } else if (type === 'question') {
            setSearchCategoryWord('')
            setSearchSubcategoryWord('')
            // setSearchQuestionWord(e.target.value)
            // setSearchAnswerWord('')
        }
        else {
            setSearchCategoryWord('')
            setSearchSubcategoryWord('')
            // setSearchQuestionWord('')
            // setSearchAnswerWord(e.target.value)
        }
        setPage(1)
    }

    const handleEnter = () => {
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleEnter()
        }
    }

    return (
        <search>
            <div className="mx-2.5">
                <input
                    type="text"
                    className="px-5 py-3 w-80 border-2 border-green-500 rounded-full text-base outline-none transition-all duration-300 ease-in-out focus:border-green-600 focus:shadow-lg focus:shadow-green-200/30 placeholder-gray-400"
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
                    onKeyDown={handleKeyDown}
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
        </search>
    )
}

export default Search