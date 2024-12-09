import React, { useState } from "react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase"
import styles from "./Home.module.css"
import { useEffect } from "react"
// import { auth } from "../firebase"
import CategoryBox from "./CategoryBox"
import { Link } from "react-router-dom"

export interface Category {
    id: number;
    name: string;
    user_id: number;    
}


const Home: React.FC = () => {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number | null>(null) 
    // 初期値をnullに設定。そうすることで、
    const [limit, setLimit] = useState(9);

    // 検索機能用
    const [searchWord, setSearchWord] = useState<string>("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
        setPage(1); // 新しい検索時にページをリセット
        console.log(searchWord)
    };

    useEffect(() => {
        // ページネーションのためのページ数を取得
        const getPageCount = async () => {
            const skip = 0;
            const response = await fetch('http://127.0.0.1:8000/categories/page_count')
            if (response.ok) {
                const data = await response.json();
                setPageCount(data)
                console.log(data)
            }
        }
        if (pageCount === 0) {
        }
        getPageCount()
    }, [])

    useEffect(() => {
        if (pageCount !== null) {
            if (page < 1) {
                setPage(1)
                return
            }  
            if (page > pageCount) {
                setPage(pageCount)
                return
            }
        }

        const skip = (page - 1) * limit;
        console.log(skip)
        const getCategories = () => {
            const url = `http://127.0.0.1:8000/categories?skip=${skip}&limit=${limit}&word=${searchWord}`;
            fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                // if (data.length === 0) {
                if (data.length > 0) {
                    setCategoryList(data)
                }
                // return
            })
        }
        getCategories()

    }, [page, limit, pageCount, searchWord])

    return (
        <>
            <div>
                <Link to="/createcategory">Create Category</Link>
            </div>
            <div className={styles.search_section}>
                <div className={styles.search_container}>
                    <input type="text" className={styles.search_box}value={searchWord} onChange={handleSearch} placeholder="カテゴリ検索"/>
                </div>
                <div className={styles.search_container}>
                    <input type="text" className={styles.search_box}value={searchWord} onChange={handleSearch} placeholder="サブカテゴリ検索"/>
                </div>
                <div className={styles.search_container}>
                    <input type="text" className={styles.search_box}value={searchWord} onChange={handleSearch} placeholder="カテゴリ or サブカテゴリ検索"/>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.category_container}>
                    {categoryList.map((category) => {
                        return (
                            <CategoryBox category={category} key={category.id}></CategoryBox>
                        )
                    })}
                </div>
            </div>
            <div className={styles.pagination}>
                <button className={styles.pagination_btn} onClick={() => setPage(page - 1)}>Previous</button>
                <button className={`${styles.pagination_btn} ${styles.left_btn}`} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </>
    )
}

export default Home