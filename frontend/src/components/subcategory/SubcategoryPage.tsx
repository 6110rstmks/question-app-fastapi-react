import React from 'react'
import { useState } from 'react'
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
import { Search, Edit3, Trash2, Eye, EyeOff, Play, Plus, Filter, ArrowLeft, MoreHorizontal } from 'lucide-react'


const SubcategoryPage: React.FC = () => {
    const navigate = useNavigate()

    const { subcategoryId: subcategoryIdStr } = useParams<{ subcategoryId: string }>()
    const subcategoryId = Number(subcategoryIdStr)
    const [searchQuery, setSearchQuery] = useState("")

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

      const getStatusColor = (status: any) => {
    switch (status) {
      case SolutionStatus.Correct:
        return "from-emerald-400 to-emerald-600";
      case SolutionStatus.Temporary:
        return "from-amber-400 to-amber-600";
      case SolutionStatus.Incorrect:
        return "from-rose-400 to-rose-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  }

  const getStatusBadge = (status: any) => {
    switch (status) {
      case SolutionStatus.Correct:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case SolutionStatus.Temporary:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case SolutionStatus.Incorrect:
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Breadcrumb & Title */}
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span 
                                className="font-medium"
                                onClick={() => handleNavigateToCategoryPage(navigate, categoryInfo)}
                                >{categoryInfo.name}</span>
                        </button>
                    
                        <div className="h-6 w-px bg-slate-300"></div>
                    
                        {isEditing ? (
                            <input
                            type="text"
                            value={subcategoryName}
                            onChange={(e) => setSubcategoryName(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            onKeyPress={handleKeyPress}
                            autoFocus
                            className="text-2xl font-bold bg-transparent border-b-2 border-indigo-500 focus:outline-none text-slate-800"
                            />
                        ) : (
                            <h1 
                            onDoubleClick={() => setIsEditing(true)}
                            className="text-2xl font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors flex items-center space-x-2 group"
                            >
                            <span>{subcategoryName}</span>
                            <Edit3 size={18} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                            </h1>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button className="p-2 hover:bg-white/60 rounded-xl transition-colors group">
                            <Filter size={20} className="text-slate-600 group-hover:text-indigo-600" />
                        </button>
                        <button className="p-2 hover:bg-white/60 rounded-xl transition-colors group">
                            <MoreHorizontal size={20} className="text-slate-600 group-hover:text-indigo-600" />
                        </button>
                        <button 
                            onClick={handleDeleteSubcategory}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-rose-500/25 flex items-center space-x-2">
                            <Trash2 size={16} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:shadow-indigo-500/10 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Questions</p>
                <p className="text-3xl font-bold text-slate-800">{questionCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:shadow-rose-500/10 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Temporary</p>
                <p className="text-3xl font-bold text-amber-600">{uncorrectedQuestionCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
              </div>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:shadow-rose-500/10 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Unsolved</p>
                <p className="text-3xl font-bold text-rose-600">{uncorrectedQuestionCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl flex items-center justify-center">
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setShowAnswer(!showAnswer)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-medium ${
                  showAnswer 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showAnswer ? "Hide Answers" : "Show Answers"}</span>
              </button>
              
              <button 
                onClick={handleSetUnsolvedProblem}
                className="flex items-center space-x-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all font-medium shadow-lg shadow-rose-500/25">
                <Play size={16} />
                <span>Practice Incorrect</span>
              </button>
              
              <button 
                onClick={handleSetTemporaryProblem}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all font-medium shadow-lg shadow-amber-500/25">

                <Play size={16} />
                <span>Practice Temporary</span>
              </button>
              
              <button 
                onClick={() => setModalIsOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-emerald-500/25"
              >
                <Plus size={16} />
                <span>New Question</span>
              </button>
            </div>
          </div>
        </div>

  {/* Questions Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {questions.map((question) => (
        <div 
            key={question.id}
            className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col min-h-[300px]"
        >
            {/* Status Indicator */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusBadge(question.is_correct)}`}>
                <span className="truncate max-w-[80px]">{question.is_correct}</span>
            </div>
            
            {/* Gradient Border Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(question.is_correct)} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Title Section - Fixed height with overflow handling */}
                <div className="flex-shrink-0 mb-4 pr-20"> {/* pr-20 to avoid overlap with status badge */}
                    <h3 
                        onClick={() => handleNavigateToQuestionPage(
                            navigate,
                            question.id,
                            categoryInfo.id,
                            categoryInfo.name,
                            subcategoryId,
                            subcategoryName
                        )}
                        className="text-slate-800 font-semibold line-clamp-4 group-hover:text-indigo-600 transition-colors leading-relaxed text-sm md:text-base overflow-hidden"
                        title={question.problem} // Tooltip for full text
                    >
                        {question.problem}
                    </h3>
                </div>
                
                {/* Answer Section - Expandable area */}
                {showAnswer && (
                    <div className="flex-1 mt-auto">
                        <div className="pt-4 border-t border-slate-200">
                            {question.answer.map((answer, index) => (
                                <div key={index} className="text-slate-600 text-sm leading-relaxed bg-slate-50/50 rounded-lg p-3 mb-2 last:mb-0">
                                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                                        {answer.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {isLatex(line) ? (
                                                    <div className="my-2 overflow-x-auto">
                                                        <BlockMath math={line} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="break-words">{line}</span>
                                                        {i < answer.split('\n').length - 1 && <br />}
                                                    </>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Quick Actions - Always at bottom */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <div className="flex space-x-2 flex-shrink-0">
                        <button 
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit question"
                        >
                            <Edit3 size={14} className="text-slate-400" />
                        </button>
                        <button 
                            className="p-2 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Delete question"
                        >
                            <Trash2 size={14} className="text-rose-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ))}
</div>

        {/* Empty State or Load More */}
        {questions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No questions yet</h3>
            <p className="text-slate-500 mb-6">Create your first question to get started</p>
            <button 
              onClick={() => setModalIsOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25"
            >
              Create Question
            </button>
          </div>
        )}
        </div>

        {/* Modal */}
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
    </div>
    )
}

export default SubcategoryPage
