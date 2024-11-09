import React, { useState } from "react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase"
import  "./Home.css"
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
            // fetch(`http://127.0.0.1:8000/categories?skip=${skip}&limit=${limit}`)
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
            <Link to="/createcategory">Create Category</Link>
            <div>
                カテゴリ検索ボックス
                <input type="text" value={searchWord} onChange={handleSearch} placeholder="検索キーワードを入力"/>
                </div>
            <div className="container">
                <div className="category-container">
                    {categoryList.map((category) => {
                        return (
                            <CategoryBox category={category} key={category.id}></CategoryBox>
                        )
                    })}
                </div>
            </div>
            <div className="pagination">
                <button className="pagination-btn" onClick={() => setPage(page - 1)}>Previous</button>
                <button className="pagination-btn left-btn" onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </>
    )
}

export default Home