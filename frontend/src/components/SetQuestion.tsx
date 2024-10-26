import { get } from 'http';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SetQuestion.css';

export interface Category {
    id: number;
    name: string;
    user_id: number;    
}

const SetQuestion: React.FC = () => {
    const location = useLocation();
    const [problem, setProblem] = useState<string>('');
    const [answers, setAnswers] = useState<string[]>(['']);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [selectedType, setSelectedType] = useState<string>('random')


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

    useEffect(() => {
        getCategories()
    }, [])
    return (
        <div className="">
            <p>出題する問題数：「５」</p>

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
                    name="scales"/>未正当の問題から出題する
            </div>


            {selectedType === 'category' && (
                <div className='bbb'>
                    <p>以下からカテゴリを選択する。</p>
                    {categoryList.map((category) => (
                        <div key={category.id}>
                            <h2>{category.name}</h2>
                        </div>
                    ))}
                </div>
            )}

            <br></br>
            <div>
                <button className="set-question-box">問題を出題。</button>
            </div>


        </div>
    );
}

export default SetQuestion