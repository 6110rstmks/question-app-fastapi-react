import React, { useState } from 'react'
import useSetProblemPage from './hooks/useSetProblemPage'
import styles from './SetProblemPage.module.css'
import Calendar from '../Calendar'
import { SolutionStatus } from '../../types/SolutionStatus'

const SetProblemPage: React.FC = () => {
    const [
        isDisplayCalendar, 
        setIsDisplayCalendar
    ] = useState<boolean>(false)

    // 月/日形式でフォーマット（例: 8/5）
    const formatMonthDay = (date: Date) =>
      `${date.getMonth() + 1}/${date.getDate()}`

    const {
        categories,
        questionCount,
        showAll,
        selectedType,
        setSelectedType,
        problemCount,
        setProblemCount,
        selectedCategoryIds,
        subcategories,
        handleSetProblem,
        handleCheckboxChange,
        handleTodayReview,
        solutionStatusNumber,
        setSolutionStatusNumber,
    } = useSetProblemPage()

    return (
        <div>
        <div className={styles.header}>
            <button onClick={() => setIsDisplayCalendar(prev => !prev)}>
                カレンダーから問題を復習
            </button>
        </div>


            {/* Calendar Modal */}
            {isDisplayCalendar && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={() => setIsDisplayCalendar(prev => !prev)}>
                            ✕
                        </button>
                        <Calendar />
                    </div>
                </div>
            )}

            <div>
                <button onClick={handleTodayReview}>前日といた問題を復習</button>
                <button onClick={handleTodayReview}>今日といた問題を復習</button>
                <div>前日の日付: {formatMonthDay(new Date(new Date().setDate(new Date().getDate() - 1)))}（）</div>
                <div>本日の日付: {formatMonthDay(new Date())}（）</div>
                <div>翌日の日付: {formatMonthDay(new Date(new Date().setDate(new Date().getDate() + 1)))}</div>
            </div>

            <div className={styles.problemSelector}>
                <h2>Select Problem</h2>
                <p>The total number of Questions：<span>{questionCount}</span></p>
                <div className={styles.problemCount}>
                    <span>Number of Questions to Answer：{problemCount}</span>
                    <div className={styles.counterButtons}>
                    <button onClick={() => setProblemCount(prev => Math.max(1, prev - 1))}>-</button>
                    <button onClick={() => setProblemCount(prev => prev + 1)}>+</button>
                    </div>
                </div>

                <div> 
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            checked={solutionStatusNumber === SolutionStatus.Temporary}
                            value={SolutionStatus.Temporary}
                            onChange={(e) => {setSolutionStatusNumber(Number(e.target.value))}}
                        />
                        <span>15日前にTemporaryになった問題から出題する。</span>
                    </label>
                </div>
                <div className={styles.secondLabel}> 
                    <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            checked={solutionStatusNumber === SolutionStatus.Incorrect}
                            value={SolutionStatus.Incorrect}
                            onChange={(e) => {setSolutionStatusNumber(Number(e.target.value))}}
                        />
                        <span>InCorrectの問題から出題する。</span>
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
                                        {/* <span>
                                            {toggleQuestionCount 
                                                ? `《${category.incorrected_answered_question_count}》`
                                                : `《${category.temporary_answered_question_count}》`}
                                        </span> */}
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