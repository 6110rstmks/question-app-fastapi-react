import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import QuestionCreate from '../question/QuestionCreateModal'
import { useSubcategoryPage } from './hooks/useSubcategoryPage'
import { 
    handleNavigateToCategoryPage,
     handleNavigateToQuestionPage 
} from '../../utils/navigate_function'
import { BlockMath } from 'react-katex'
import { SolutionStatus } from '../../types/SolutionStatus'
import { isLatex } from '../../utils/function'

const SubcategoryPage: React.FC = () => {
    const navigate = useNavigate()

    const { subcategoryId: subcategoryIdStr } = useParams<{ subcategoryId: string }>()
    const subcategoryId = Number(subcategoryIdStr)

    const { 
        modalIsOpen, 
        setModalIsOpen,
        subcategoryName, 
        setSubcategoryName, 
        questions, setQuestions, 
        categoryInfo, 
        handleDeleteSubcategory,
        showAnswer,
        setShowAnswer,
        isEditing,
        setIsEditing,
        questionCount,
        uncorrectedQuestionCount,
        handleKeyPress,
        handleSetUnsolvedProblem,
        handleSetTemporaryProblem
    } = useSubcategoryPage(subcategoryId)

    return (
        <div className="p-4">
            <div className="w-1/4 flex justify-between items-center mb-4">
                <div 
                    onClick={() => handleNavigateToCategoryPage(navigate, categoryInfo)}
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                    {categoryInfo.name}＞
                </div>
                {isEditing ? (
                    <input
                        type="text"
                        value={subcategoryName}
                        onChange={(e) => setSubcategoryName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onBlur={() => setIsEditing(false)}
                        autoFocus
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <h1 
                        onDoubleClick={() => setIsEditing(true)}
                        className="cursor-pointer text-2xl font-bold hover:text-gray-600"
                    >{subcategoryName}</h1>
                )}                
                <button 
                    className="w-22 h-22 text-white bg-yellow-green rounded-full cursor-pointer text-sm break-words hover:bg-opacity-80 transition-colors"
                    onClick={handleDeleteSubcategory}
                >
                    Delete
                </button>
                <button 
                    className="w-30 h-22 text-white bg-yellow-green rounded-full cursor-pointer text-xs break-words hover:bg-opacity-80 transition-colors"
                >
                    15日より前のincorrectの問題に絞って表示する
                </button>
            </div>
            
            <div className="mb-4">
                <div className="mb-2 text-gray-700">ワードで検索する</div>
                <input 
                    type="text" 
                    placeholder="問題文を入力してください"
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />              
            </div>
            
            <div className="flex justify-between mt-5 mb-6">
                <div className="flex gap-4">
                    <button 
                        className={`w-22 h-22 text-white rounded-full text-sm break-words transition-colors ${
                            showAnswer 
                                ? 'bg-yellow-green hover:bg-opacity-80' 
                                : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                        onClick={() => setShowAnswer((prev) => !prev)}
                    >
                        {showAnswer ? "答えを一括非表示" : "答えを一括表示"}
                    </button>
                    <button 
                        className="w-30 h-22 text-white bg-yellow-green rounded-full cursor-pointer text-xs break-words hover:bg-opacity-80 transition-colors"
                        onClick={handleSetUnsolvedProblem}
                    >
                        incorrectから問題を出題する。
                    </button>
                    <button 
                        className="w-30 h-22 text-white bg-yellow-green rounded-full cursor-pointer text-xs break-words hover:bg-opacity-80 transition-colors"
                        onClick={handleSetTemporaryProblem}
                    >
                        temporaryの問題を出題数する
                    </button>
                    <button 
                        className="w-22 h-22 text-white bg-yellow-green rounded-full text-sm break-words hover:bg-opacity-80 transition-colors"
                        onClick={() => setModalIsOpen(true)}
                    >
                        Create Question
                    </button>
                </div>
                <div>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        // onClick={()}
                    >
                        このサブカテゴリを別のカテゴリを付け替える。
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">問題の数：{questionCount}</h3>
            <h3 className="text-lg font-semibold mb-6">未正当の問題の数：{uncorrectedQuestionCount}</h3>
            
            <Modal
                isOpen={modalIsOpen}
                contentLabel="Example Modal"
            >
                <QuestionCreate 
                    categoryId={categoryInfo.id} 
                    subcategoryId={subcategoryId} 
                    setModalIsOpen={setModalIsOpen}
                    setQuestions={setQuestions}
                />
            </Modal>
            
            <div className="flex flex-wrap -mx-2">
                {questions.map((question) => (
                    <div 
                        className={`
                            w-1/4 px-2 mb-6
                        `}
                        key={question.id}
                    >
                        <div className={`
                            pt-4 px-8 pb-4 rounded-2xl shadow-lg transition-transform hover:scale-105 ${
                                question?.is_correct === SolutionStatus.Correct 
                                    ? 'bg-green-200' 
                                    : question?.is_correct === SolutionStatus.Temporary 
                                    ? 'bg-yellow-600' 
                                    : 'bg-red-300'
                            }
                        `}>
                            <h3 
                                className="cursor-pointer underline text-gray-700 text-base mb-3 break-words hover:text-gray-900 transition-colors"
                                onClick={() => handleNavigateToQuestionPage(
                                    navigate,
                                    question.id,
                                    categoryInfo.id,
                                    categoryInfo.name,
                                    subcategoryId,
                                    subcategoryName
                                )}
                            >
                                {question.problem}
                            </h3>
                            
                            {showAnswer && question.answer.map((answer, index) => (
                                <div key={index} className="text-black text-sm">
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
                ))}
            </div>
        </div>
    )
}

export default SubcategoryPage
