import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import CreateQuestion from './CreateQuestion';
import styles from './SubcategoryPage.module.css';

interface LocationState {
    category_id: number;
    category_name: string;
}

interface Question {
    id: number;
    problem: string;
    answer: string[];
    memo: string;
    subcategory_id: number;
}

const SubcategoryPage: React.FC = () => {
    const { subcategory_id } = useParams<{ subcategory_id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const subcategoryId = subcategory_id ? parseInt(subcategory_id, 10) : 0;
    const { category_id, category_name } = location.state as LocationState;
    
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [subCategoryName, setSubCategoryName] = useState<string>('');
    const [questionList, setQuestionList] = useState<Question[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [expandedQuestions, setExpandedQuestions] = useState<{ [key: number]: boolean }>({});

    const toggleQuestion = (questionId: number) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const refreshQuestionList = async () => {
        const response = await fetch(`http://localhost:8000/questions/subcategory_id/${subcategory_id}`);
        if (response.ok) {
            const data: Question[] = await response.json();
            setQuestionList(data);
        }
    };

    const updateSubcategoryName = async () => {
        const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: subCategoryName }),
        });

        if (!response.ok) {
            throw new Error('Failed to update subcategory');
        }
    };

    const handleDelete = async () => {
        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");
        if (confirmation !== '削除') return;

        const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete subcategory');
        }
        navigate('/');
    };

    const handleQuestionClick = (question_id: number) => {
        navigate(`/question/${question_id}`, {
            state: {
                subcategoryName: subCategoryName,
                categoryName: category_name
            }
        });
    };

    useEffect(() => {
        const getSubcategory = async () => {
            const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`);
            if (response.ok) {
                const data = await response.json();
                setSubCategoryName(data.name);
            }
        };

        getSubcategory();
        refreshQuestionList();
    }, [subcategory_id]);

    return (
        <div className={styles.container}>
            {/* Breadcrumb Navigation */}
            <div className={styles.breadcrumb}>
                <button onClick={() => navigate(-1)} className={styles.breadcrumbButton}>
                    ←戻る
                </button>
                <span>/</span>
                <span>{category_name}</span>
                <span>/</span>
                <span>{subCategoryName}</span>
            </div>

            {/* Header Section */}
            <div className={styles.headerSection}>
                <div className={styles.headerLeft}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={subCategoryName}
                            onChange={(e) => setSubCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateSubcategoryName()}
                            onBlur={() => setIsEditing(false)}
                            className={styles.titleInput}
                            autoFocus
                        />
                    ) : (
                        <h1 
                            className={styles.title}
                            onDoubleClick={() => setIsEditing(true)}
                        >
                            {subCategoryName}
                        </h1>
                    )}
                    <button
                        onClick={handleDelete}
                        className={styles.deleteButton}
                    >
                        削除
                    </button>
                </div>
                <button 
                    onClick={() => setModalIsOpen(true)}
                    className={styles.createButton}
                >
                    問題を作成
                </button>
            </div>

            {/* Questions List */}
            <div className={styles.questionList}>
                {questionList.map((question) => (
                    <div key={question.id} className={styles.questionCard}>
                        <div 
                            className={styles.questionHeader}
                            onClick={() => toggleQuestion(question.id)}
                        >
                            <div className={styles.questionTitleWrapper}>
                                <h3 className={styles.questionTitle}>{question.problem}</h3>
                                <span className={`${styles.chevronIcon} ${expandedQuestions[question.id] ? styles.chevronIconRotated : ''}`}>
                                    ▼
                                </span>
                            </div>
                        </div>
                        
                        <div className={`
                            ${styles.questionContent}
                            ${expandedQuestions[question.id] ? styles.questionContentExpanded : styles.questionContentCollapsed}
                        `}>
                            <div className={styles.answerList}>
                                {question.answer.map((answer, index) => (
                                    <div key={index} className={styles.answerItem}>
                                        <span className={styles.bullet}>•</span>
                                        <span>{answer}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.detailsButton}>
                                <button
                                    onClick={() => handleQuestionClick(question.id)}
                                    className={styles.createButton}
                                >
                                    詳細を見る
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Question Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className={styles.modal}
                overlayClassName={styles.modalOverlay}
            >
                <CreateQuestion
                    category_id={category_id}
                    subcategory_id={subcategoryId}
                    setModalIsOpen={setModalIsOpen}
                    refreshQuestionList={refreshQuestionList}
                />
            </Modal>
        </div>
    );
};

export default SubcategoryPage;