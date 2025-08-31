import React, { useState } from 'react'
import useSetProblemPage from './hooks/useSetProblemPage'
import CalendarModal from '../CalendarModal'
import { SolutionStatus } from '../../types/SolutionStatus'
import { Calendar,Target, Clock, AlertCircle, Play, RotateCcw,BookOpen } from 'lucide-react'

const SetProblemPage: React.FC = () => {
    const [
        isDisplayCalendar, 
        setIsDisplayCalendar
    ] = useState<boolean>(false)

    // 月/日形式でフォーマット（例: 8/5）
    const formatMonthDay = (date: Date) =>
      `${date.getMonth() + 1}/${date.getDate()}`

    
    const getDayOfWeek = (date: Date) => {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[date.getDay()]
    }

    const {
        questionCount,
        handleSetProblem,
        handleTodayReview,
        solutionStatusNumber,
        setSolutionStatusNumber,
    } = useSetProblemPage()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-8">
                    <div className="flex items-center gap-3 mb-6 px-6 py-3 inline-flex items-center">
                            <Target className="h-6 w-6 text-purple-600" />
                            <h2 className="text-xl font-semibold text-gray-900">問題を出題する。</h2>
                    </div>
                </div>

                {/* Question Count Display */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-700 font-medium">総問題数</p>
                            <p className="text-3xl font-bold text-purple-800">{questionCount}</p>
                        </div>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">カレンダー復習</h2>
                    </div>
                    
                    <button
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        onClick={() => setIsDisplayCalendar(prev => !prev)}
                    >
                        <Calendar className="h-5 w-5" />
                        カレンダーから問題を復習
                    </button>

                    {/* Calendar Modal */}
                    {isDisplayCalendar && (
                        <CalendarModal 
                            setIsDisplayCalendar={setIsDisplayCalendar}
                        />
                    )}

                </div>

                {/* Daily Review Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="h-6 w-6 text-green-600" />
                        <h2 className="text-xl font-semibold text-gray-900">日次復習</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <button 
                            onClick={handleTodayReview}
                            className="bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-500 hover:to-red-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                            <RotateCcw className="h-5 w-5" />
                            前日の問題を復習
                        </button>
                        <button 
                            onClick={handleTodayReview}
                            className="bg-gradient-to-r from-green-400 to-emerald-400 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                            <BookOpen className="h-5 w-5" />
                            今日の問題を復習
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                            <div className="font-medium text-orange-700">前日</div>
                            <div className="text-orange-600">
                                {formatMonthDay(new Date(new Date().setDate(new Date().getDate() - 1)))}
                                （{getDayOfWeek(new Date(new Date().setDate(new Date().getDate() - 1)))}）
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                            <div className="font-medium text-blue-700">本日</div>
                            <div className="text-blue-600">
                                {formatMonthDay(new Date())}
                                （{getDayOfWeek(new Date())}）
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                            <div className="font-medium text-green-700">翌日</div>
                            <div className="text-green-600">
                                {formatMonthDay(new Date(new Date().setDate(new Date().getDate() + 1)))}
                                （{getDayOfWeek(new Date(new Date().setDate(new Date().getDate() + 1)))}）
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Problem Selector */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
  

                    {/* Solution Status Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">回答状態選択</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    checked={solutionStatusNumber === SolutionStatus.Temporary}
                                    value={SolutionStatus.Temporary}
                                    onChange={(e) => setSolutionStatusNumber(Number(e.target.value))}
                                    className="w-5 h-5 text-yellow-600"
                                />
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                    <span className="font-medium text-yellow-800">15日前にTemporaryになった問題から出題する</span>
                                </div>
                            </label>
                            
                            <label className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    checked={solutionStatusNumber === SolutionStatus.Incorrect}
                                    value={SolutionStatus.Incorrect}
                                    onChange={(e) => setSolutionStatusNumber(Number(e.target.value))}
                                    className="w-5 h-5 text-red-600"
                                />
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <span className="font-medium text-red-800">Incorrectの問題から出題する</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-200">
                        <button 
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                            onClick={handleSetProblem}
                        >
                            <Play className="h-5 w-5" />
                            問題を開始する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetProblemPage