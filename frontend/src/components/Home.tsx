import React, { useState } from "react"
import { useCategories } from "../hooks/useCategories"
import CategoryList from "./category/CategoryList"
import Pagination from "./Pagination"
import { Link } from "react-router-dom"
import styles from "./Home.module.css"
import Search from "./SearchWithCategoryBox"

const Home: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(6);
    const [searchCategoryWord, setSearchCategoryWord] = useState<string>("");
    const [searchSubcategoryWord, setSearchSubcategoryWord] = useState<string>("");
    const [searchQuestionWord, setSearchQuestionWord] = useState<string>("");
    const [searchAnswerWord, setSearchAnswerWord] = useState<string>("");
    const { categories, pageCount, questionCount, uncorrectedquestionCount } = useCategories(page, limit, searchCategoryWord, searchSubcategoryWord, searchQuestionWord, searchAnswerWord);

    return (
        <>
            <Link to="/createcategory" className={styles.createCategoryBtn}>Create Category</Link>
            <Link to="/question_list">Question一覧検索ページ</Link>
            <h3>The total number of Questions：{questionCount}</h3>
            <h3>不正解のQuestion数：{uncorrectedquestionCount}</h3>
            <Pagination
                    currentPage={page}
                    totalPages={pageCount}
                    onPageChange={(newPage) => setPage(newPage)}
            />
            <div className={styles.containerA}>
                <Search 
                    type="category"
                    searchCategoryWord={searchCategoryWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
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
export default Home;
