import { get } from 'http';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SetProblem.module.css';

export interface Category {
    id: number;
    name: string;
    user_id: number;    
}

const SetProblem: React.FC = () => {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [selectedType, setSelectedType] = useState<string>('random')
    const [incorrectedOnlyFlgChecked, setIncorrectedOnlyFlgChecked] = useState<boolean>(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [problemCnt, setProblemCnt] = useState<number>(5);


    const navigate = useNavigate();
    const getCategories = async () => {
        // const response = await fetch('http://localhost:8000/categories/all')
        const response = await fetch('http://localhost:8000/categories/all_categories_with_questions')
        if (response.ok) {
            const data: Category[] = await response.json();
            setCategoryList(data);
            console.log(data)
        }
    }
    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedType(event.target.value);
    }

    const handleCheckboxChange = (categoryId: number) => {
        console.log(selectedCategoryIds)
        setSelectedCategoryIds((prevSelected) => {
            // すでに選択されている場合は取り除き、選択されていない場合は追加する
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    const handleIncrement = () => {
        setProblemCnt(problemCnt + 1);
      };
    
      const handleDecrement = () => {
        setProblemCnt(problemCnt - 1);
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
        getCategories()
    }, [])
    return (
        <div className="">
            <div className={styles.problemCnt}>
                <p>出題する問題数：「{problemCnt}」</p>
                <button onClick={handleIncrement}>+</button>
                <button onClick={handleDecrement}>-</button>
            </div>


            <form action="">
                <label>
                    <input 
                    type="radio" 
                    name="type" 
                    value="random"
                    checked={selectedType === 'random'}
                    onChange={handleTypeChange}
                    />ランダムに出題
                </label>
                <br></br>
                <label>
                    <input 
                    type="radio" 
                    name="type"
                    value="category"
                    checked={selectedType === 'category'}
                    onChange={handleTypeChange}
                    />カテゴリから選択
                </label>
            </form>

            <div className='solve-again-checkbox'>
                <input 
                    type="checkbox" 
                    id="scales" 
                    checked={incorrectedOnlyFlgChecked}
                    name="scales"/>未正当の問題から出題する
            </div>


            {selectedType === 'category' && (
            <div className='bbb'>
                <p>以下からカテゴリを選択する。</p>
                {categoryList.map((category) => (
                    <div key={category.id}>
                        <input
                            type="checkbox"
                            id={`checkbox-${category.id}`}
                            checked={selectedCategoryIds.includes(category.id)}
                            onChange={() => handleCheckboxChange(category.id)}
                        />
                        <label htmlFor={`checkbox-${category.id}`}>
                            <span>{category.name}</span>
                        </label>
                    </div>
                ))}
            </div>
            )}

            <br></br>
            <div>
                <button className="set-question-box" onClick={setProblems}>問題を出題。</button>
            </div>


        </div>
    );
}

export default SetProblem