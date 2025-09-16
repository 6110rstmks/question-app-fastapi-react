import React, { useState } from "react"
import { useNavigate } from "react-router"

import type { Category } from "../../types/Category"
import { createCategory } from "../../api/CategoryAPI"

const CategoryCreate: React.FC = () => {
    const [categoryName, setCategoryName] = useState<string>("")
    const [errMessage, setErrorMessage] = useState<string>("")
    const navigate = useNavigate()

    const handleAddCategory = async (name: string) => {
        if (!name.trim()) {
            setErrorMessage("カテゴリー名を入力してください")
            return
        }
        const category: Category = await createCategory(name)
        if (!category) {
            setErrorMessage("カテゴリーの作成に失敗しました")
        } else {
            navigate("/")
        }
    }

    return (
        <div className="createPostPage">
            <div className="postContainer">
                <h1>Create Category</h1>
                <div className="inputPost">
                    <div>CategoryName</div>
                    <input 
                        type="text" 
                        placeholder="タイトルを記入" 
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)} 
                        autoFocus
                    />
                </div>
                <button className="categoryButton" onClick={() =>handleAddCategory(categoryName)}>
                    Create
                </button>
                <div>{errMessage && <p>{errMessage}</p>}</div>
            </div>
        </div>
    )
}

export default CategoryCreate
