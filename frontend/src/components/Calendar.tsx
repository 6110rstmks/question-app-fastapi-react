import React, { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns"
import styles from "./Calendar.module.css"
import { fetchQuestionCountsByLastAnsweredDate } from "../api/QuestionAPI"
import { fetchProblemByDay } from "../api/ProblemAPI"
import { useNavigate } from 'react-router-dom'

const Calendar: React.FC = () => {
    const [
        currentDate, 
        setCurrentDate
    ] = useState(new Date())

    const [
        questionCounts, 
        setQuestionCounts
    ] = useState<Record<string, number>>({})

    const startMonth = startOfMonth(currentDate)
    const endMonth = endOfMonth(currentDate)
    const startDate = startOfWeek(startMonth)
    const endDate = endOfWeek(endMonth)

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const navigate = useNavigate()

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

    const handleSetProblemByDay = async (day: Date) => {
        const problemData = await fetchProblemByDay(day)
        navigate('/problem', { 
            state: {
                problemData, 
                from: 'setProblemPage'
            }
        })
    }

    useEffect(() => {
        const days_array = days.map(day => format(day, "yyyy-MM-dd"));
        // days_arrayをAPIに送信して、それに紐づくQuestionを取得する
        const fetchCounts = async () => {
            const data: Record<string, number> = await fetchQuestionCountsByLastAnsweredDate(days_array);
            setQuestionCounts(data);
        };
        fetchCounts()
    }
    , [currentDate])

    return (
        
        <div className={styles.calendar_container}>
            <div>
                <input type="checkbox" name="" id="" />
                temporaryのみを表示する
            </div>

            {/* ヘッダー */}
            <div className={styles.calendar_header}>
                <button onClick={prevMonth} className={styles.nav_button}>◀</button>
                <h2 className={styles.calendar_title}>{format(currentDate, "yyyy年 MM月")}</h2>
                <button onClick={nextMonth} className={styles.nav_button}>▶</button>
            </div>

            {/* 曜日 */}
            <div className={styles.calendar_weekdays}>
                {["日", "月", "火", "水", "木", "金", "土"].map(day => (
                <div key={day} className={styles.weekday}>{day}</div>
                ))}
            </div>

            {/* 日付 */}
            <div className={styles.calendar_grid}>
                {days.map(day => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    console.log("dateStr", dateStr)
                    const questionCount = questionCounts[dateStr];
                    return (
                        <div
                            key={day.toISOString()}
                            className={`${styles.calendar_day} 
                                        ${format(day, "MM") !== format(currentDate, "MM") ? styles.other_month : ""}
                                        ${format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? styles.today : ""}`}
                            onClick={() => handleSetProblemByDay(day)}
                        >
                            <div>{format(day, "d")}</div>
                            {questionCount > 0 && <div className={styles.question_count}>{questionCount}件</div>}
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Calendar
