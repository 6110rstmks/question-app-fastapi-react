import React from 'react'
import type { ChangeEvent } from 'react'
import type { Question } from '../../types/Question'
import { useQuestionEditModal } from './hooks/useQuestionEditModal'
import { SolutionStatus } from '../../types/SolutionStatus'

interface QuestionEditProps {
    setModalIsOpen: (isOpen: boolean) => void
    question?: Question
    setQuestion: (question: Question) => void
}

const QuestionEditModal: React.FC<QuestionEditProps> = ({
    setModalIsOpen,
    question,
    setQuestion,
}) => {

    const { 
        inputProblemValue,
        inputAnswerValue,
        isCorrect,
        inputMemoValue,
        setInputMemoValue,
        setInputAnswerValue,
        updateQuestion,
        setInputProblemValue,
        handleIsCorrectChange,
        handleCloseModal,
        handleAnswerChange
    } = useQuestionEditModal(
        question, 
        setQuestion, 
        setModalIsOpen
    )

    return (   
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg">
                    <h2 className="text-2xl font-bold">Edit Question</h2>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* 問題文セクション */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Problem:
                        </label>
                        <textarea
                            placeholder="問題文を記入"
                            value={inputProblemValue}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputProblemValue(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-vertical min-h-[100px]"
                            rows={4}
                        />
                    </div>

                    {/* 答えセクション */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-semibold text-gray-700">
                                Answer:
                            </label>
                            <button 
                                onClick={() => setInputAnswerValue([...inputAnswerValue, ''])}
                                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>答えを追加</span>
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {inputAnswerValue.map((answer, index) => (
                                <div key={index} className="flex space-x-3">
                                    <div className="flex-1">
                                        <textarea 
                                            placeholder="投稿内容を記入"
                                            value={answer}
                                            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(index, event.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-vertical min-h-[80px]"
                                            rows={3}
                                        />
                                    </div>
                                    {inputAnswerValue.length > 1 && (
                                        <button 
                                            onClick={() =>
                                                setInputAnswerValue(inputAnswerValue.filter((_, i) => i !== index))
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 h-fit flex items-center space-x-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* メモセクション */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Memo:
                        </label>
                        <textarea
                            value={inputMemoValue}
                            onChange={(e) => setInputMemoValue(e.target.value)}
                            placeholder="メモを入力..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-vertical min-h-[100px]"
                            rows={4}
                        />
                    </div>

                    {/* 判定セクション */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                            判定:
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition duration-200">
                                <input
                                    type="radio"
                                    value={SolutionStatus.Correct.toString()} 
                                    checked={isCorrect === SolutionStatus.Correct} 
                                    onChange={handleIsCorrectChange}
                                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                />
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Correct</span>
                                </div>
                            </label>
                            
                            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition duration-200">
                                <input
                                    type="radio"
                                    value={SolutionStatus.Temporary.toString()}
                                    checked={isCorrect === SolutionStatus.Temporary}
                                    onChange={handleIsCorrectChange}
                                    className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                                />
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Temporary</span>
                                </div>
                            </label>
                            
                            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition duration-200">
                                <input
                                    type="radio"
                                    value={SolutionStatus.Incorrect.toString()} 
                                    checked={isCorrect === SolutionStatus.Incorrect}
                                    onChange={handleIsCorrectChange}
                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">Incorrect</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* フッターボタン */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button 
                            onClick={handleCloseModal} 
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Close</span>
                        </button>      
                        <button 
                            onClick={updateQuestion} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionEditModal