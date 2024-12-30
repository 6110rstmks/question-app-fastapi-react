import { get } from 'http';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SetProblem.module.css';
import { Category } from '../../types/Category';
import { fetchAllCategoriesWithQuestions } from '../../api/CategoryAPI';

// 問題を出題して、
const SetProblem: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedType, setSelectedType] = useState<string>('random')
    const [incorrectedOnlyFlgChecked, setIncorrectedOnlyFlgChecked] = useState<boolean>(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [problemCnt, setProblemCnt] = useState<number>(5);
    const navigate = useNavigate();

    const handleCheckboxChange = (categoryId: number) => {
        setSelectedCategoryIds((prevSelected) => {
            // すでに選択されている場合は取り除き、選択されていない場合は追加する
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    // ボタンをクリックしたら、問題群を生成して、問題出題画面に遷移する。その際レスポンスのデータを渡す。
    const setProblems = async () => {
        try {
            const response = await fetch('http://localhost:8000/problems/generate_problems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                                        type: selectedType,
                                        incorrected_only_flg: incorrectedOnlyFlgChecked,
                                        problem_cnt: problemCnt,
                                        category_ids: selectedCategoryIds
                                    }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create problems');
            }
            const problemData = await response.json();
            navigate('/problem', { state: problemData });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error.message);
                alert(error.message);  // Display the error message to the user
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }
    
    useEffect(() => {
        (async () => {
            const response = await fetchAllCategoriesWithQuestions();
            setCategories(response);
        })()
    }, [])

    return (
        <div className={styles.problemSelector}>
            <h2>問題選択</h2>
            
            <div className={styles.problemCount}>
                <span>出題する問題数：{problemCnt}</span>
                <div className={styles.counterButtons}>
                <button onClick={() => setProblemCnt(prev => Math.max(1, prev - 1))}>-</button>
                <button onClick={() => setProblemCnt(prev => prev + 1)}>+</button>
                </div>
            </div>

            <div className={styles.radioGroup}>
                <label>
                <input
                    type="radio"
                    name="type"
                    value="random"
                    checked={selectedType === 'random'}
                    onChange={(e) => setSelectedType(e.target.value)}
                />
                <span>ランダムに出題</span>
                </label>
                
                <label>
                <input
                    type="radio"
                    name="type"
                    value="category"
                    checked={selectedType === 'category'}
                    onChange={(e) => setSelectedType(e.target.value)}
                />
                <span>カテゴリから選択</span>
                </label>
            </div>

            <label className={styles.checkboxLabel}>
                <input
                type="checkbox"
                checked={incorrectedOnlyFlgChecked}
                onChange={(e) => setIncorrectedOnlyFlgChecked(e.target.checked)}
                />
                <span>未正当の問題から出題する</span>
            </label>

            {selectedType === 'category' && (
                <div className={styles.categorySection}>
                <p>以下からカテゴリを選択する。</p>
                <div className={styles.categoryList}>
                    {categories.map((category) => (
                    <label key={category.id} className="checkbox-label">
                        <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(category.id)}
                        onChange={() => handleCheckboxChange(category.id)}
                        />
                        <span>{category.name}</span>
                    </label>
                    ))}
                </div>
                </div>
            )}

            <button className={styles.submitButton} onClick={setProblems}>問題を出題</button>
        </div>
    );
}

export default SetProblem