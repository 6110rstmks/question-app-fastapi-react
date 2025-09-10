import React from 'react'
import type { ChangeEvent } from 'react'
import type { Question } from '../../types/Question'
import { useQuestionCreateModal } from './hooks/useQuestionCreateModal'

interface QuestionCreateProps {
    categoryId: number
    subcategoryId: number
    setModalIsOpen: (isOpen: boolean) => void
    setQuestions: (questions: Question[]) => void
}

const QuestionCreateModal: React.FC<QuestionCreateProps> = ({
    categoryId,
    subcategoryId,
    setModalIsOpen,
    setQuestions
}) => {
    const {
        problem,
        setProblem,
        answers,
        inputMemoValue,
        setInputMemoValue,
        removeAnswerInput,
        createQuestion,
        handleAnswerChange,
        addAnswerField,
    } = useQuestionCreateModal(
        categoryId,
        subcategoryId,
        setQuestions,
        setModalIsOpen
    )

    return (
   <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="px-6 py-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 m-0">Create Question</h2>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Problem:</label>
          <textarea
            placeholder="問題文を入力"
            value={problem}
            className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm transition-all duration-150 ease-in-out focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProblem(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Answer:</label>
            <button 
              onClick={addAnswerField} 
              className="px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-150 ease-in-out bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              答えを追加
            </button>
          </div>

          {answers.map((answer, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <textarea
                placeholder="投稿内容を記入"
                className="flex-1 px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
                value={answer}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(index, e.target.value)}
              />
              {answers.length > 1 && (
                <button 
                  onClick={() => removeAnswerInput(index)}
                  className="px-2 py-2 text-red-500 bg-transparent border-none cursor-pointer flex items-center hover:text-red-700"
                >
                  削除
                </button>
              )}               
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Memo:</label>
          <textarea
            value={inputMemoValue}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputMemoValue(e.target.value)}
            className="w-full min-h-[100px] px-3 py-3 border border-gray-300 rounded-md text-sm resize-y focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button 
            onClick={createQuestion} 
            className="px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-150 ease-in-out bg-blue-600 text-white border-none hover:bg-blue-700"
          >
            Save
          </button>
        </div>   
        
        <div className="mt-4">                        
          <button 
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-150 ease-in-out bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
          >
            Close
          </button>
        </div> 
      </div>        
    </div>
    )
}

export default QuestionCreateModal

