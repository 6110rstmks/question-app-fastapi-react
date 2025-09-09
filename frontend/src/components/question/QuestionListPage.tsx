import React from 'react'
import { handleNavigateToQuestionPage } from "../../utils/navigate_function"
import { useNavigate } from "react-router"
import { useQuestionListPage } from "./hooks/useQuestionListPage"
import { SolutionStatus } from '../../types/SolutionStatus'
import { Search, BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react'


const QuestionListPage = () => {
    const navigate = useNavigate()
    const { 
        questions,
        setSearchWord,
        handleSearchQuestionClick,
    } = useQuestionListPage()

    const getStatusIcon = (status: any) => {
        switch(status) {
            case SolutionStatus.Correct:
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case SolutionStatus.Temporary:
                return <Clock className="w-5 h-5 text-yellow-500" />
            default:
                return <XCircle className="w-5 h-5 text-red-500" />
        }
    }

    const getStatusStyle = (status: any) => {
        switch(status) {
            case SolutionStatus.Correct:
                return 'border-green-200 bg-green-50 hover:bg-green-100'
            case SolutionStatus.Temporary:
                return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
            default:
                return 'border-red-200 bg-red-50 hover:bg-red-100'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center space-x-3">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">問題検索システム</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                    問題文を検索
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="search"
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="キーワードを入力してください..."
                                        onChange={(e) => setSearchWord(e.target.value)}
                                        autoFocus={true}
                                    />
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button 
                                    onClick={() => handleSearchQuestionClick()}
                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    検索する
                                </button>
                            </div>
                        </div>
                        
                        {/* Category Filter Notice */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                <p className="text-sm text-amber-800 font-medium">
                                    カテゴリを絞っての問題文の検索を行えるようにしたい
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            検索結果 ({questions.length}件)
                        </h2>
                    </div>
                    
                    <div className="grid gap-4">
                        {questions.map((question) => (
                            <div 
                                key={question.id} 
                                className={`
                                    group cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1
                                    ${getStatusStyle(question?.is_correct)}
                                `}
                                onClick={() => handleNavigateToQuestionPage(
                                    navigate,
                                    question.id,
                                    question.categoryId,
                                    question.category_name,
                                    question.subcategoryId
                                )}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        {getStatusIcon(question?.is_correct)}
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {question.category_name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">ID: {question.id}</span>
                                </div>

                                {/* Problem */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                        Problem
                                    </h3>
                                    <p className="text-gray-900 font-medium leading-relaxed">
                                        {question.problem}
                                    </p>
                                </div>

                                {/* Answer */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                                        Answer
                                    </h4>
                                    <div className="space-y-2">
                                        {question?.answer.map((answer, index) => (
                                            <div key={index} className="bg-white bg-opacity-60 rounded-lg p-3">
                                                {answer.split('\n').map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        <span className="text-gray-700 leading-relaxed">{line}</span>
                                                        {i < answer.split('\n').length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hover Effect Arrow */}
                                <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="text-blue-600 text-sm font-medium flex items-center space-x-1">
                                        <span>詳細を見る</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {questions.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
                            <p className="text-gray-500">別のキーワードで検索してみてください</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuestionListPage