import React, { useState } from "react"
import { useCategories } from "../hooks/useCategories"
import CategoryList from "./category/CategoryList"
import Pagination from "./Pagination"
import { Link } from "react-router-dom"
import styles from "./Home.module.css"
import Search from "./Search"

const Home: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(6);
    const [searchCategoryWord, setSearchCategoryWord] = useState<string>("");
    const [searchSubcategoryWord, setSearchSubcategoryWord] = useState<string>("");
    const [searchQuestionWord, setSearchQuestionWord] = useState<string>("");
    const { categories, pageCount, questionCount } = useCategories(page, limit, searchCategoryWord, searchSubcategoryWord, searchQuestionWord);

    return (
        <>
            <Link to="/createcategory" className={styles.createCategoryBtn}>Create Category</Link>
            <h3>不正解のQuestion数：{questionCount}</h3>
            <div className={styles.containerA}>
                <Pagination
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={(newPage) => setPage(newPage)}
                />
                <Search 
                    type="category"
                    searchCategoryWord={searchCategoryWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    page={page} 
                    setPage={setPage} 
                />
                <Search 
                    type="subcategory"
                    searchSubcategoryWord={searchSubcategoryWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    page={page} 
                    setPage={setPage} 
                />
                <Search 
                    type="question"
                    searchQuestionWord={searchQuestionWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    page={page} 
                    setPage={setPage} 
                />
            </div>
            <CategoryList categories={categories} searchSubcategoryWord={searchSubcategoryWord} searchQuestionWord={searchQuestionWord} />
            <Pagination
                currentPage={page}
                totalPages={pageCount}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </>
    );
};
export default Home;
