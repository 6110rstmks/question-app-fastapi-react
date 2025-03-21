import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal'
import QuestionCreate from '../question/QuestionCreateModal';
import styles from "./SubcategoryPage.module.css";
import { useSubcategoryPage } from './hooks/useSubcategoryPage';
import { handleNavigateToCategoryPage, handleNavigateToQuestionPage } from '../../utils/navigate_function';

const SubcategoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const { subcategoryId: subcategoryIdStr } = useParams<{ subcategoryId: string }>();
    const subcategoryId = Number(subcategoryIdStr)

    const { subcategoryName, 
        setSubcategoryName, 
        questions, setQuestions, 
        categoryInfo, 
        handleDeleteSubcategory,
        showAnswer,
        setShowAnswer,
        isEditing,
        setIsEditing,
        handleKeyPress,
        handleSetProblem
    } = useSubcategoryPage(subcategoryId)

    return (
        <div className={styles.subcategory_page}>

            <div className={styles.subcategory_box}>
                <div 
                    onClick={() => handleNavigateToCategoryPage(navigate, categoryInfo)}
                    className={styles.category_name}
                >
                    {categoryInfo.name}＞
                </div>
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
                    <h1 
                        onDoubleClick={() => setIsEditing(true)}
                        className={styles.subcategory_name}
                    >{subcategoryName}</h1>
                )}                
                <button className={styles.delete_btn} onClick={handleDeleteSubcategory}>Delete</button>
            </div>
            <button 
                className={`${styles.create_question_btn} ${showAnswer ? styles.on : styles.off}`} 
                onClick={() => setShowAnswer((prev) => !prev)}
            >
                {showAnswer ? "答えを一括非表示" : "答えを一括表示"}
            </button>
            <button 
                className={styles.display_incorrected_question_btn}
                onClick={handleSetProblem}>
                このサブカテゴリから問題を出題する。
            </button>
            <button 
                className={styles.create_question_btn}
                onClick={() => setModalIsOpen(true)}>
                    Create Question
            </button>
            <button 
                className={styles.display_incorrected_question_btn}
                >未正解の問題に絞って表示する
            </button>
            <Modal
                isOpen={modalIsOpen}
                contentLabel="Example Modal"
            >
                <QuestionCreate 
                    categoryId={categoryInfo.id} 
                    subcategoryId={subcategoryId} 
                    setModalIsOpen={setModalIsOpen}
                    setQuestions={setQuestions}
                />
            </Modal>
            <div className={styles.question_container}>
                {questions.map((question) => (
                    <div 
                        className={`
                            ${styles.question_box} 
                            ${question.is_correct ? styles.correct : styles.incorrect}
                        `} 
                        key={question.id}>
                        <h3 className={styles.problem_text} 
                            onClick={() => handleNavigateToQuestionPage(
                                            navigate,
                                            question.id,
                                            categoryInfo.id,
                                            categoryInfo.name,
                                            subcategoryId,
                                            subcategoryName)}>
                            {question.problem}
                        </h3>
                        {/* isOn が true の場合のみ answer を表示 */}
                        {showAnswer && question.answer.map((answer, index) => (
                            <div key={index}>
                                {answer.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default SubcategoryPage;
