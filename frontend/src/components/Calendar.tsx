import React, { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval } from "date-fns"
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
        <div className="w-[860px] h-[658px] mx-auto my-10 p-4 bg-white shadow-lg rounded-lg">
            <div className="mb-3">
                <input type="checkbox" name="" id="" className="mr-2" />
                temporaryのみを表示する
            </div>

            {/* ヘッダー */}
            <div className="flex justify-between items-center mb-3">
                <button 
                    onClick={prevMonth} 
                    className="bg-transparent border-none text-xl cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                    ◀
                </button>
                <h2 className="text-lg font-bold">{format(currentDate, "yyyy年 MM月")}</h2>
                <button 
                    onClick={nextMonth} 
                    className="bg-transparent border-none text-xl cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                    ▶
                </button>
            </div>

            {/* 曜日 */}
            <div className="grid grid-cols-7 text-center font-bold mb-1">
                {["日", "月", "火", "水", "木", "金", "土"].map(day => (
                    <div key={day} className="py-2">{day}</div>
                ))}
            </div>

            {/* 日付 */}
            <div className="grid grid-cols-7 gap-11 cursor-pointer">
                {days.map(day => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    console.log("dateStr", dateStr)
                    const questionCount = questionCounts[dateStr];
                    const isOtherMonth = format(day, "MM") !== format(currentDate, "MM");
                    const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                    
                    return (
                        <div
                            key={day.toISOString()}
                            className={`text-center p-2.5 rounded text-sm hover:bg-gray-50 transition-colors ${
                                isOtherMonth ? "text-gray-300" : ""
                            } ${
                                isToday ? "bg-blue-500 text-white font-bold rounded-full" : ""
                            }`}
                            onClick={() => handleSetProblemByDay(day)}
                        >
                            <div>{format(day, "d")}</div>
                            {questionCount > 0 && (
                                <div className="text-xs mt-1">
                                    {questionCount}件
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar
