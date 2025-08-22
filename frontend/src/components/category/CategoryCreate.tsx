import React, { useState } from "react"
import { useNavigate } from "react-router"
import { createCategory } from "../../api/CategoryAPI"

const CategoryCreate: React.FC = () => {
    const [categoryName, setCategoryName] = useState<string>("")
    const [errMessage, setErrorMessage] = useState<string>("")
    const navigate = useNavigate();

    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            setErrorMessage("カテゴリー名を入力してください")
            return
        }
        const response = await createCategory(categoryName)
        if (!response.ok) {
            const data = await response.json()
            setErrorMessage(data.detail)
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
                <button className="categoryButton" onClick={handleAddCategory}>
                    Create
                </button>
                <div>{errMessage && <p>{errMessage}</p>}</div>
            </div>
        </div>
    );
};

export default CategoryCreate;
