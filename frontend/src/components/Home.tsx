import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import CategoryList from "./category/CategoryList";
import SearchCategory from "./category/CategorySearch";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(6);
    const [searchCategoryWord, setSearchCategoryWord] = useState<string>("");
    const { categories, pageCount, questionCount } = useCategories(page, limit, searchCategoryWord);

    return (
        <>
            <Link to="/createcategory">Create Category</Link>
            <h1>残りの不正解のQuestion数をここに表示。{questionCount}</h1>
            <SearchCategory searchWord={searchCategoryWord} setSearchWord={setSearchCategoryWord} page={page} setPage={setPage} />
            <div className={styles.container}>
                <CategoryList categories={categories} />
            </div>
            <Pagination
                currentPage={page}
                totalPages={pageCount}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </>
    );
};
export default Home;
