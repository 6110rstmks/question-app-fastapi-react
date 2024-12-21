import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateCategory.module.css";

interface CreateCategoryProps {
    isAuth: boolean;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({ isAuth }) => {
    const [categoryName, setCategoryName] = useState<string>("");
    const [errMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    const createCategory = async () => {
        try {
            const response = await fetch('http://localhost:8000/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryName }),
            });

            if (!response.ok) {
                const data = await response.json();
                console.log(data.detail);
                setErrorMessage(data.detail)
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error(error);
            // 必要に応じてエラーメッセージをユーザーに表示する
        }
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, [isAuth, navigate]);

    return (
        <div className="createPostPage">
            <div className="postContainer">
                <h1>カテゴリを作成</h1>
                <div className="inputPost">
                    <div>カテゴリ名</div>
                    <input 
                        type="text" 
                        placeholder="タイトルを記入" 
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)} 
                        autoFocus
                    />
                </div>
                <button className="categoryButton" onClick={createCategory}>
                    作成
                </button>
                <div>{errMessage && <p>{errMessage}</p>}</div>
            </div>
        </div>
    );
};

export default CreateCategory;
