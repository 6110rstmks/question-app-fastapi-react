import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import "./SubcategoryPage.css";
import { useNavigate } from "react-router-dom"
import Modal from 'react-modal'
import CreateQuestion from './CreateQuestion';


// types.ts
export interface Subcategory {
    id: number;
    name: string;
    category_id: number;
}

export interface Question {
    id: number;
    problem: string;
    answer: string[];
    subcategory_id: number;
}


const SubcategoryPage: React.FC = () => {
    const { subcategory_id } = useParams<{ subcategory_id: string }>();
    const navigate = useNavigate();

    const location = useLocation()
    const subcategoryId = subcategory_id ? parseInt(subcategory_id, 10) : 0;
    const categoryId = location.state as number;
    const ids = {
        subcategory_id: subcategoryId,
        category_id: categoryId
    };
    const [isEditing, setIsEditing] = useState<boolean>(false); // 編集モードの状態

    const [subCategoryName, setSubCategoryName] = useState<string>('');
    const [questionList, setQuestionList] = useState<Question[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);


    const refreshQuestionList = async () => {
        const response = await fetch(`http://localhost:8000/questions/subcategory_id/${subcategory_id}`);
        if (response.ok) {
            const data: Question[] = await response.json();
            setQuestionList(data);
        }
    };

    // サブカテゴリ名の更新を処理する関数
    const updateSubcategoryName = async () => {
        try {
            const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                                        name: subCategoryName 
                                    }),
            });

            if (!response.ok) {
                throw new Error('Failed to update subcategory');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ダブルクリックで編集モードに切り替える
    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    // 入力フィールドでの変更を反映
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubCategoryName(e.target.value);
    };

    // エンターキーで編集モードを終了し、サブカテゴリ名を更新
    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            await updateSubcategoryName();
        }
    };

    // 削除ボタンを押すと、そのサブカテゴリーを削除する。
    // その際、「削除」と入力してクリックすることで削除が実行される。
    const handleDelete = async () => {

        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");

        if (confirmation !== '削除') {
            return;
        }

        const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete subcategory');
        }
        navigate('/');
    }


    useEffect(() => {
        const getSubcategory = async () => {
            const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`);
            if (response.ok) {
                const data: Subcategory = await response.json();
                setSubCategoryName(data.name);
            }
        };

        // const getQuestions = async () => {
        //     const response = await fetch(`http://localhost:8000/questions/subcategory_id/${subcategory_id}`);
        //     if (response.ok) {
        //         const data: Question[] = await response.json();
        //         setQuestionList(data);
        //     }
        // };

        getSubcategory();
        // getQuestions();
        refreshQuestionList();
    }, [subcategory_id]);

    return (
        <div className='subcategory-page'>
            <div className='subcategory-box'>
            {isEditing ? (
                    <input
                        type="text"
                        value={subCategoryName}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        onBlur={() => setIsEditing(false)} // フォーカスを外すと編集モードを終了
                        autoFocus
                    />
                ) : (
                    <h1 onDoubleClick={handleDoubleClick}>{subCategoryName}</h1>
                )}                <button className='delete-btn' onClick={handleDelete}>Delete</button>
            </div>
            {/* <Link 
                to={{ pathname: "/createquestion" }}
                state={ids}
            >
                Questionを作成する
            </Link> */}
            <button onClick={() => setModalIsOpen(true)}>Questionを作成する</button>
            <Modal
            isOpen={modalIsOpen}
            contentLabel="Example Modal"
            >
                <CreateQuestion 
                    category_id={categoryId} 
                    subcategory_id={subcategoryId} 
                    setModalIsOpen={setModalIsOpen}
                    refreshQuestionList={refreshQuestionList}  // 質問リスト更新関数を渡す
                />
            </Modal>
            <div className='question-container'>
                {questionList.map((question) => (
                    <div className="question-box" key={question.id}>
                        <h2>{question.problem}</h2>
                        {question.answer.map((answer, index) => (
                            <p key={index}>{answer}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubcategoryPage;
