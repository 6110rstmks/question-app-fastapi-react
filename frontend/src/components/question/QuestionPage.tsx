import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import Modal from 'react-modal'
import QuestionEditModal from './QuestionEditModal'
import ChangeCategorySubcategory from '../ChangeCategorySubcategoryModal'
import { useQuestionPage } from './hooks/useQuestionPage'
import { BlockMath } from 'react-katex'
import RenderMemoWithLinks from '../RenderMemoWithLinks'
import { SolutionStatus } from '../../types/SolutionStatus'
import { isLatex } from '../../utils/function'
import { handleUpdateIsCorrect } from '../../utils/function'

interface QuestionPageNavigationParams {
    categoryId: number,
    subcategoryId: number,
    categoryName: string,
    subcategoryName: string
}

const QuestionPage: React.FC = () => {
    const location = useLocation()
    const { questionId: questionIdStr } = useParams<{ questionId: string }>()
    const questionId = Number(questionIdStr)

    const [
        editModalIsOpen,
        setEditModalIsOpen
    ] = useState<boolean>(false)

    const [
        changeSubcategoryModalIsOpen,
        setChangeSubcategoryModalIsOpen
    ] = useState<boolean>(false)

    // location.stateがnullの場合にlocalStorageから取得
    const storedCategoryInfo = localStorage.getItem('categorySubcategoryInfo')
    const parsedCategoryInfo = storedCategoryInfo ? JSON.parse(storedCategoryInfo) : {}
    const state: QuestionPageNavigationParams = location.state || parsedCategoryInfo

    const { 
        categoryId,
        subcategoryId,
        categoryName,
        subcategoryName
    } = state

    const { 
        subcategoriesWithCategoryName,
        setSubcategoriesWithCategoryName,
        question,
        setQuestion,
        showAnswer,
        setShowAnswer,
        handleDeleteQuestion,
        handleAnswerQuestion,
    } = useQuestionPage(
        questionId,
        changeSubcategoryModalIsOpen,
        editModalIsOpen
    )

    // ページ遷移時にカテゴリ情報をローカルストレージに保存
    useEffect(() => {
      if (location.state) {
            localStorage.setItem('categorySubcategoryInfo', JSON.stringify(location.state));
      }
    }, [location.state])

  return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
                {subcategoriesWithCategoryName.map((subcategoryWithCategoryName, index) => (         
                    <nav key={index} className="flex items-center space-x-2 text-sm font-medium">
                        <Link 
                            to={`/category/${categoryId}`}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline"
                        >
                            {subcategoryWithCategoryName.categoryName}
                        </Link>
                        <span className="text-gray-400 select-none">›</span>
                        <Link
                            to={`/subcategory/${subcategoryWithCategoryName.id}`}
                            state={{ id: categoryId, name: categoryName }}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline"
                        >
                            {subcategoryWithCategoryName.name}
                        </Link>
                    </nav>
                ))}
            </div>

            {/* Main Question Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-white font-bold text-xl">
                    Question ID: {question?.id}
                    </h1>
                    <div className="text-indigo-100 text-sm font-medium">
                    {question?.last_answered_date.slice(0, 10)}
                    </div>
                </div>
                </div>

                {/* Question Content */}
                <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
                    {/* Problem Section */}
                    <div className="flex-1">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                        問題
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-indigo-500">
                        {question?.problem && question.problem.includes('\\') ? (
                            <BlockMath math={question.problem} />
                        ) : (
                            <div className="text-gray-700 leading-relaxed">
                                {RenderMemoWithLinks(question?.problem || '')}
                            </div>
                        )}
                        </div>
                    </div>
                    </div>

                    {/* Status Badge */}
                    <div className="lg:w-48 flex-shrink-0">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-3">ステータス</h3>
                        <button
                            className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                                question?.is_correct === SolutionStatus.Correct ? 
                                    'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 
                                question?.is_correct === SolutionStatus.Temporary ? 
                                    'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 
                                    'bg-red-500 text-white shadow-lg shadow-red-500/25'
                            }`}
                            onClick={() => handleUpdateIsCorrect(question, setQuestion)}
                        >
                            {question?.is_correct === SolutionStatus.Incorrect ? 'Incorrect' :
                            question?.is_correct === SolutionStatus.Temporary ? 'Temp Correct' :
                            'Correct'}
                        </button>
                    </div>
                    </div>
                </div>

                {/* Answer Section */}
                <div className="mb-8">
                    <button
                        className={`w-full px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                            showAnswer ? 
                                'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 
                                'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setShowAnswer(!showAnswer)}
                    >
                        {showAnswer ? '🔼 回答を隠す' : '🔽 回答を表示'}
                    </button>
                    
                    <div className={`mt-4 transition-all duration-300 overflow-hidden ${
                        showAnswer ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-100">
                        {question?.answer.map((answer, index) => (
                            <div key={index} className="text-gray-700 leading-relaxed">
                                {answer.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                    {isLatex(line) ? (
                                        <BlockMath math={line} />
                                    ) : (
                                        <>
                                        {line}
                                        <br />
                                        </>
                                    )}
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <button 
                        onClick={() => handleDeleteQuestion(categoryId, subcategoryId, questionId, categoryName)} 
                        className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 shadow-lg shadow-red-500/25 transform hover:scale-105"
                    >
                        🗑️ DELETE
                    </button>
                    <button 
                        onClick={() => handleAnswerQuestion(question!)}
                        className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200 shadow-lg shadow-emerald-500/25 transform hover:scale-105"
                    >
                        ✅ この問題を回答した！
                    </button>
                    <button 
                        onClick={() => setEditModalIsOpen(true)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 shadow-lg shadow-blue-500/25 transform hover:scale-105"
                    >
                        ✏️ Edit
                    </button>
                    <button 
                        onClick={() => setChangeSubcategoryModalIsOpen(true)}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors duration-200 shadow-lg shadow-purple-500/25 transform hover:scale-105"
                    >
                        🔄 Change Category
                    </button>
                </div>

                {/* Memo Section */}
                {question?.memo && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border-l-4 border-amber-400">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                            メモ
                        </h3>
                        <div className="text-gray-700 leading-relaxed">
                            {RenderMemoWithLinks(question.memo)}
                        </div>
                    </div>
                )}
                </div>
            </div>

            {/* Stats Card */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    統計情報
                </h2>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                    回答回数: {question?.answer_count}
                </div>
                </div>
            </div>

            {/* Debug Info */}
            <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm font-medium bg-gray-100 rounded-lg py-2 px-4 inline-block">
                🔧 bキーで問題の表示・非表示を切り替え
                </p>
            </div>
            </div>

            {/* Modals */}
            <Modal 
                isOpen={editModalIsOpen} 
                contentLabel="Edit Question Modal"
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            >
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                <QuestionEditModal
                    setModalIsOpen={setEditModalIsOpen}
                    question={question}
                    setQuestion={setQuestion}
                />
                </div>
            </Modal>
            
            <Modal 
                isOpen={changeSubcategoryModalIsOpen} 
                contentLabel="Change Category Modal"
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            >
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                <ChangeCategorySubcategory
                    categoryId={categoryId}
                    defaultCategoryName={categoryName}
                    question={question}
                    setModalIsOpen={setChangeSubcategoryModalIsOpen}
                    setSubcategoriesRelatedToQuestion={setSubcategoriesWithCategoryName}
                />
                </div>
            </Modal>
        </div>
      </>
  )
}

export default QuestionPage