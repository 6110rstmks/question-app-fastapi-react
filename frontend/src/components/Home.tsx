import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import CategoryList from "./category/CategoryList";
import SearchCategory from "./SearchCategory";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(9);
    const [searchWord, setSearchWord] = useState<string>("");

    const { categoryList, pageCount } = useCategories(page, limit, searchWord);

    return (
        <>
            <Link to="/createcategory">Create Category</Link>
            <SearchCategory searchWord={searchWord} setSearchWord={setSearchWord} page={page} setPage={setPage} />
            <div className={styles.container}>
                <CategoryList categories={categoryList} />
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
