import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import Modal from 'react-modal'
import QuestionCreate from '../question/QuestionCreate';
import styles from "./SubcategoryPage.module.css";
import styles_common from "./common.module.css";
import { updateSubcategoryName } from '../../api/SubcategoryAPI';
import { useSubcategoryPage } from './hooks/useSubcategoryPage';

interface locationState {
    category_id: number;
    category_name: string;
}

const SubcategoryPage: React.FC = () => {
    const { subcategory_id } = useParams<{ subcategory_id: string }>();
    const navigate = useNavigate();

    const location = useLocation()
    const subcategoryId = subcategory_id ? parseInt(subcategory_id, 10) : 0;
    const { subcategoryName, setSubcategoryName, questions, setQuestions, categoryInfo } = useSubcategoryPage(subcategoryId, location.state)
    
    // サブカテゴリ名の編集モードの状態を管理
    // ダブルクリックでサブカテゴリ名の編集モードに切り替える
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    // 回答の表示非表示ボタンの状態を管理
    const [isOn, setIsOn] = useState(false); 

    // エンターキーで編集モードを終了し、サブカテゴリ名を更新
    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            await updateSubcategoryName(subcategoryId, subcategoryName);
        }
    };

    // 削除ボタンを押すと、そのサブカテゴリーを削除する。
    // その際、「削除」と入力してクリックすることで削除が実行される。
    const handleDeleteSubcategory = async () => {

        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");

        if (confirmation !== '削除') {
            return;
        }

        const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            prompt('Failed to delete subcategory');
        }
        navigate('/');
    }

    const handleNavigateToQuestionPage = (question_id: number) => {
        navigate(`/question/${question_id}`, { 
            state: {
                category_id: categoryInfo.id,
                subcategory_id: subcategory_id,
                subcategoryName: subcategoryName, 
                categoryName: categoryInfo.name 
            } 
        });
    }

    return (
        <div className={styles.subcategory_page}>
            <button 
                className={`${styles.toggleButton} ${isOn ? styles.on : styles.off}`} 
                onClick={() => setIsOn((prev) => !prev)}
            >
                {isOn ? "答えを一括非表示" : "答えを一括表示"}
            </button>
            <div className={styles.subcategory_box}>
            <span>{categoryInfo.name}＞</span>
            {isEditing ? (
                    <input
                        type="text"
                        value={subcategoryName}
                        onChange={(e) => setSubcategoryName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onBlur={() => setIsEditing(false)} // フォーカスを外すと編集モードを終了
                        autoFocus
                    />
                ) : (
                    <h1 >
                        <span
                            onDoubleClick={() => setIsEditing(true)}
                        >{subcategoryName}</span>
                    </h1>
                )}                
                <button className={styles.delete_btn} onClick={handleDeleteSubcategory}>Delete</button>
            </div>
            <button className={styles.create_question_btn} onClick={() => setModalIsOpen(true)}>Create Question</button>
            <Modal
                isOpen={modalIsOpen}
                contentLabel="Example Modal"
            >
                <QuestionCreate 
                    category_id={categoryInfo.id} 
                    subcategory_id={subcategoryId} 
                    setModalIsOpen={setModalIsOpen}
                    setQuestions={setQuestions}
                />
            </Modal>
            <div className={styles.question_container}>
                {questions.map((question) => (
                    <div 
                    className={`${styles.question_box} ${question.is_correct ? styles.correct : styles.incorrect}`} 
                    key={question.id}>
                        <h3 className={styles.problem_text} onClick={() => handleNavigateToQuestionPage(question.id)}>
                            {question.problem}
                        </h3>
                        {/* isOn が true の場合のみ answer を表示 */}
                        {isOn && question.answer.map((answer, index) => (
                            <p className={styles.answer_text} key={index}>・{answer}</p>
                        ))}
                    </div>
                ))}
            </div>
            <button 
                className={styles.display_incorrected_question_btn}
                >未正解の問題に絞って表示する
            </button>
        </div>
    );
};

export default SubcategoryPage;
