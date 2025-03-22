import React, { useState } from 'react';
import useSetProblemPage from './hooks/useSetProblemPage';
import styles from './SetProblemPage.module.css';
import Calendar from '../Calendar';

const SetProblemPage: React.FC = () => {
    const [toggleQuestionCnt, setToggleQuestionCnt] = useState<boolean>(false)
    const [isDisplayCalendar, setIsDisplayCalendar] = useState<boolean>(false)

    const toggleCalendar = () => {
        setIsDisplayCalendar(prev => !prev);
    }

    const {
        categories,
        questionCount,
        showAll,
        selectedType,
        setSelectedType,
        problemCnt,
        setProblemCnt,
        selectedCategoryIds,
        subcategories,
        incorrectedOnlyFlgChecked,
        setIncorrectedOnlyFlgChecked,
        handleSetProblem,
        handleCheckboxChange
    } = useSetProblemPage()

    return (
        <div>
            <button onClick={toggleCalendar}>カレンダーを表示</button>

            {/* Calendar Modal */}
            {isDisplayCalendar && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={toggleCalendar}>
                            ✕
                        </button>
                        <Calendar />
                    </div>
                </div>
            )}


            <div className={styles.problemSelector}>
            
                <p>The total number of Questions：<span>{questionCount}</span></p>
                <h2>問題選択</h2>
                <div className={styles.problemCount}>
                    <span>Number of Questions to Answer：{problemCnt}</span>
                    <div className={styles.counterButtons}>
                    <button onClick={() => setProblemCnt(prev => Math.max(1, prev - 1))}>-</button>
                    <button onClick={() => setProblemCnt(prev => prev + 1)}>+</button>
                    </div>
                </div>

                <div> 
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={incorrectedOnlyFlgChecked}
                            onChange={(e) => {
                                setIncorrectedOnlyFlgChecked(e.target.checked)
                                setToggleQuestionCnt((prev) => !prev)
                            }}
                        />
                        <span>Include Only Incorrectly Answered Questions</span>
                    </label>
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
                        <span>Random Selection</span>
                    </label>
                    
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="category"
                            checked={selectedType === 'category'}
                            onChange={(e) => setSelectedType(e.target.value)}
                        />
                        <span>Select by Category</span>
                    </label>
                </div>



                    {selectedType === 'category' && (
                        <div className={styles.categorySection}>
                        <p>Choose a Category from Below:</p>
                        <div className={styles.categoryList}>
                            {categories.map((category) => (
                                <div key={category.id} className={styles.categoryItem}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategoryIds.includes(category.id)}
                                            onChange={() => handleCheckboxChange(category.id)}
                                        />
                                    </label>
                                    <div className={styles.categoryContent}>
                                        <span>{category.name}</span> 
                                        <span>
                                            {toggleQuestionCnt 
                                                ? `《${category.incorrected_answered_question_count}》`
                                                : `《${category.question_count}》`}
                                        </span>
                                        <div
                                            className={`${styles.subcategories} ${
                                                showAll ? styles.showAll : ''
                                            }`}
                                        >
                                            <span>🔽</span>
                                            <div>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked
                                                        // onChange={() => handleCheckboxChange(category.id)}
                                                    />
                                                </label>
                                                <div>All</div>
                                            </div>
                                            <div>
                                            {subcategories
                                                .filter((subcategory) => subcategory.categoryId === category.id)
                                                .map((subcategory) => (
                                                    <div key={subcategory.id}>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                // onChange={() => handleCheckboxChange(category.id)}
                                                            />
                                                        </label>
                                                        <span>{subcategory.name}</span>
                                                    </div>
                                                ))
                                            }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>《  》は問題数</div>
                        </div>
                    )}

                <button className={styles.submitButton} onClick={handleSetProblem}>Submit Questions</button>
            </div>
        </div>
    );
}

export default SetProblemPage