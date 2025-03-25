import React, { useState } from "react"
import { useCategories } from "../hooks/useCategories"
import { CategoryList } from "./category/CategoryList"
import Pagination from "./Pagination"
import { Link } from "react-router-dom"
import styles from "./HomePage.module.css"
import Search from "./Search"

export const Home: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(6);
    const [searchCategoryWord, setSearchCategoryWord] = useState<string>("");
    const [searchSubcategoryWord, setSearchSubcategoryWord] = useState<string>("");
    const [searchQuestionWord, setSearchQuestionWord] = useState<string>("");
    const [searchAnswerWord, setSearchAnswerWord] = useState<string>("");
    const { 
        categories,
        pageCount,
        questionCount,
        uncorrectedQuestionCount
    } = useCategories(
        page,
        limit,
        searchCategoryWord,
        searchSubcategoryWord,
        searchQuestionWord,
        searchAnswerWord
    );

    return (
        <>
            <Link to="/createcategory" className={styles.createCategoryBtn}>Create Category</Link>
            <h3>The total number of Questions：{questionCount}</h3>
            <h3>The total number of uncorrected Questions：{uncorrectedQuestionCount}</h3>
            <h3>正解した問題の数{(questionCount?? 0)  - (uncorrectedQuestionCount?? 0)}</h3>
            <Pagination
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={(newPage) => setPage(newPage)}
            />
            <div className={styles.searchContainer}>
                <Search 
                    type="category"
                    searchCategoryWord={searchCategoryWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
                    autoFocus={true}
                />
                <Search 
                    type="subcategory"
                    searchSubcategoryWord={searchSubcategoryWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
                />
                <Link to="/question_list" className={styles.moreBtn}>Question一覧検索ページ</Link>

                <Search 
                    type="question"
                    searchQuestionWord={searchQuestionWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
                />
                <Search 
                    type="answer"
                    searchAnswerWord={searchAnswerWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
                /> 
            </div>
            <CategoryList categories={categories} searchSubcategoryWord={searchSubcategoryWord} searchQuestionWord={searchQuestionWord} searchAnswerWord={searchAnswerWord}/>
            <Pagination
                currentPage={page}
                totalPages={pageCount}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </>
    );
};
