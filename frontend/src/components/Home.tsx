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
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");

    // 検索機能用
    const [searchWord, setSearchWord] = useState<string>("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
        setPage(1); // 新しい検索時にページをリセット
        console.log(searchWord)
    };
  
    // ファイル選択時のイベントハンドラ
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      }
    };
  
    // フォーム送信時のイベントハンドラ
    const handleFileSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!file) {
          setMessage("ファイルを選択してください");
          return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
          const response = await fetch("http://127.0.0.1:8000/categories/import", {
            method: "POST",
            body: formData,
          });
    
          if (response.ok) {
            const data = await response.json();
            setMessage("アップロード成功: " + data.message);
          } else {
            const errorData = await response.json();
            setMessage("エラー: " + (errorData.detail || "アップロードに失敗しました"));
          }
        } catch (error) {
          setMessage("エラー: " + error);
        }
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
            <h1>JSONファイルアップロード</h1>
            <form onSubmit={handleFileSubmit}>
                <div>
                <input type="file" accept=".json" onChange={handleFileChange} />
                </div>
                <button type="submit" style={{ marginTop: "10px" }}>
                アップロード
                </button>
            </form>
            {message && <p>{message}</p>}
            <div>
                <Link to="/createcategory">Create Category</Link>
            </div>
            <div className="search-box">
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
            <div className={styles.pagination}>
                <button className="pagination-btn" onClick={() => setPage(page - 1)}>Previous</button>
                <button className="pagination-btn left-btn" onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </>
    )
}

export default Home