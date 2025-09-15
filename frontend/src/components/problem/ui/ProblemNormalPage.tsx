import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

import type { Subcategory2, SubcategoryWithCategoryName } from "../../../types/Subcategory"
import type { Question } from "../../../types/Question"
import { fetchCategory } from "../../../api/CategoryAPI"
import { fetchSubcategoriesByQuestionId } from "../../../api/SubcategoryAPI"
import { BlockMath } from "react-katex"
import Modal from 'react-modal'
import QuestionEditModal from "../../question/QuestionEditModal"
import ChangeCategorySubcategory from "../../ChangeCategorySubcategoryModal"
import RenderMemoWithLinks from '../../RenderMemoWithLinks'
import { SolutionStatus } from "../../../types/SolutionStatus"
import { isLatex } from "../../../utils/function"
import { handleUpdateIsCorrect } from "../../../utils/function"

interface Props {
    reviewFlg: boolean
    problem: Question
    problemData: Question[]
    currentProblemIndex: number
    problemLength: number
    showAnswer: boolean
    onShowAnswer: () => void
    onSolved: () => void
    onUnsolved: () => void
    editModalIsOpen: boolean
    setEditModalIsOpen: (isOpen: boolean) => void
    changeSubcategoryModalIsOpen: boolean
    setChangeSubcategoryModalIsOpen: (isOpen: boolean) => void
}

export const ProblemNormalPage: React.FC<Props> = ({
    reviewFlg,
    problem,
    // problemData,
    currentProblemIndex,
    problemLength,
    showAnswer,
    onShowAnswer,
    onSolved,
    onUnsolved,
    editModalIsOpen,
    setEditModalIsOpen,
    changeSubcategoryModalIsOpen,
    setChangeSubcategoryModalIsOpen,
}) => {

    // Questionに関連するぱんくずリスト用
    const [
        subcategoriesWithCategoryName,
        setSubcategoriesWithCategoryName
    ] = useState<SubcategoryWithCategoryName[]>([]) 

    // ローカル状態を追加(画面で表示する用)
    const [
        localProblem,
        setLocalProblem
    ] = useState<Question>(problem) 

    useEffect(() => {
        setLocalProblem(problem)

        // // problemDataも更新したい
        // const updatedProblemData = problemData.map((p) => 
        //     p.id === problem.id ? { ...p, ...problem } : p
        // )

        const fetchData = async () => {
            const subcategories: Subcategory2[] = await fetchSubcategoriesByQuestionId(problem.id)
            
            const data2: SubcategoryWithCategoryName[] = await Promise.all(
                subcategories.map(async (subcategory) => {
                    const category = await fetchCategory(subcategory.category_id)
                    return {
                        id: subcategory.id,
                        name: subcategory.name,
                        category_id: category.id,
                        category_name: category.name,
                    }
                })
            )

            setSubcategoriesWithCategoryName(data2)
        }
    
        fetchData()
    }, [problem])

    return (
       <div className="max-w-4xl mx-auto p-6 bg-white">
            {/* Header */}
            <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">
                    {currentProblemIndex + 1} / {problemLength}
                </div>
                <div className="flex flex-wrap gap-2">
                    {subcategoriesWithCategoryName.map((subcategoryWithCategoryName, index) => (         
                        <div key={index} className="flex items-center text-sm">
                            <Link 
                                to={`/category/${subcategoryWithCategoryName.category_id}`}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                {subcategoryWithCategoryName.category_name}
                            </Link>
                            <span className="mx-2 text-gray-400">＞</span>
                            <Link
                                to={`/subcategory/${subcategoryWithCategoryName.id}`}
                                state={{ 
                                    id: subcategoryWithCategoryName.category_id, 
                                    name: subcategoryWithCategoryName.category_name 
                                }}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                {subcategoryWithCategoryName.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Flag */}
            {reviewFlg && (
                <h1 className="text-2xl font-bold text-red-600 mb-4">再出題:</h1>
            )}

            {/* Question Card */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <div className="text-sm text-gray-600">
                        問題：{localProblem.last_answered_date.slice(0, 10)}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button 
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            onClick={() => setEditModalIsOpen(true)}
                        >
                            Edit
                        </button>
                        <button
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                localProblem?.is_correct === SolutionStatus.Correct 
                                    ? 'bg-green-500 text-white' 
                                    : localProblem?.is_correct === SolutionStatus.Temporary 
                                    ? 'bg-yellow-500 text-white' 
                                    : 'bg-red-500 text-white'
                            }`}
                            onClick={() => handleUpdateIsCorrect(localProblem, setLocalProblem)}
                        >
                            {localProblem?.is_correct === SolutionStatus.Incorrect ? 'incorrect' :
                            localProblem?.is_correct === SolutionStatus.Temporary ? 'temp correct' :
                            'correct'}
                        </button>
                        <button
                            className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                            onClick={() => setChangeSubcategoryModalIsOpen(true)}
                        >
                            Change Category
                        </button>
                        <button
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                            onClick={() => setChangeSubcategoryModalIsOpen(true)}
                        >
                            本日はもう表示しない
                        </button>
                    </div>
                </div>

                {/* Modals */}
                <Modal 
                    isOpen={editModalIsOpen} 
                    contentLabel="Example Modal"
                >
                    <QuestionEditModal
                        setModalIsOpen={setEditModalIsOpen}
                        question={localProblem}
                        setQuestion={setLocalProblem}
                    />
                </Modal>
                <Modal 
                    isOpen={changeSubcategoryModalIsOpen} 
                    contentLabel="カテゴリ変更モーダル"
                >
                    <ChangeCategorySubcategory
                        categoryId={subcategoriesWithCategoryName[0]?.category_id || 0}
                        defaultCategoryName={subcategoriesWithCategoryName[0]?.category_name || ''}
                        question={localProblem}
                        setModalIsOpen={setChangeSubcategoryModalIsOpen}
                        setSubcategoriesRelatedToQuestion={setSubcategoriesWithCategoryName}
                    />
                </Modal>
                    
                {/* Question Content */}
                <div className="mb-6 text-gray-800 leading-relaxed">
                    {RenderMemoWithLinks(localProblem.problem)}
                </div>

                {/* Show Answer Button or Answer Section */}
                {!showAnswer ? (
                    <button 
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        onClick={onShowAnswer}
                    >
                        答えを表示する
                    </button>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">答え</h3>
                        <div className="bg-white p-4 rounded border">
                            {localProblem.answer && localProblem.answer.length > 0 ? (
                                localProblem.answer.map((answer, index) => (
                                    <div key={index} className="mb-4 last:mb-0">
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
                                ))
                            ) : (
                                <p className="text-gray-500 italic">解答はまだ作成されていません</p>
                            )}
                        </div>
                        
                        {/* Memo Section */}
                        {localProblem.memo && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">メモ</h3>
                                <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                                    {localProblem.memo.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {RenderMemoWithLinks(line)}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
                <button 
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    onClick={onSolved}
                >
                    解けた
                </button>
                <button 
                    className="px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    onClick={onUnsolved}
                >
                    解けなかった
                </button>
            </div>
        </div>
    )
}

