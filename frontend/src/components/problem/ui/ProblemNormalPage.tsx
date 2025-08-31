import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import type { SubcategoryWithCategoryName } from "../../../types/Subcategory"
import type { Question } from "../../../types/Question";
import { fetchSubcategoriesWithCategoryNameByQuestionId } from "../../../api/SubcategoryAPI"
import { BlockMath } from "react-katex"
import Modal from 'react-modal'
import QuestionEditModal from "../../question/QuestionEditModal"
import ChangeCategorySubcategory from "../../ChangeCategorySubcategoryModal"
import RenderMemoWithLinks from '../../RenderMemoWithlinks'
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
            const data_subcategories_with_category_name = await fetchSubcategoriesWithCategoryNameByQuestionId(problem.id)
            console.log('data_subcategories_with_category_name', data_subcategories_with_category_name)
            setSubcategoriesWithCategoryName(data_subcategories_with_category_name)
        };
    
        fetchData()
    }, [problem])

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="text-lg font-semibold text-gray-700">
                {currentProblemIndex + 1} / {problemLength}
            </div>
            <div className="flex flex-wrap gap-2">
                {subcategoriesWithCategoryName.map((subcategoryWithCategoryName, index) => (         
                    <div key={index} className="flex items-center text-sm">
                        <a
                            href={`/category/${subcategoryWithCategoryName.category_id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                            {subcategoryWithCategoryName.category_name}
                        </a>
                        <span className="mx-2 text-gray-400">＞</span>
                        <a
                            href={`/subcategory/${subcategoryWithCategoryName.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                            {subcategoryWithCategoryName.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>

        {reviewFlg && (
            <h1 className="text-2xl font-bold text-red-600 mb-4">再出題:</h1>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
                <div className="text-sm text-gray-600">
                    問題：{localProblem.last_answered_date.slice(0, 10)}
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button 
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        onClick={() => setEditModalIsOpen(true)}
                    >
                        Edit
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                            localProblem?.is_correct === SolutionStatus.Correct ? 'bg-green-500 text-white hover:bg-green-600' : 
                            localProblem?.is_correct === SolutionStatus.Temporary ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 
                            'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        onClick={() => handleUpdateIsCorrect(localProblem, setLocalProblem)}
                    >
                        {localProblem?.is_correct === SolutionStatus.Incorrect ? 'incorrect' :
                        localProblem?.is_correct === SolutionStatus.Temporary ? 'temp correct' :
                        'correct'}
                    </button>
                    <button
                        className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                        onClick={() => setChangeSubcategoryModalIsOpen(true)}
                    >
                        Change Category
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                        onClick={() => setChangeSubcategoryModalIsOpen(true)}
                    >
                        本日はもう表示しない
                    </button>
                </div>
            </div>

            <Modal 
                isOpen={editModalIsOpen} 
                contentLabel="Example Modal"
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                    <QuestionEditModal
                        setModalIsOpen={setEditModalIsOpen}
                        question={localProblem}
                        setQuestion={setLocalProblem}
                    />
                </div>
            </Modal>
            
            <Modal 
                isOpen={changeSubcategoryModalIsOpen} 
                contentLabel="カテゴリ変更モーダル"
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                    <ChangeCategorySubcategory
                        categoryId={subcategoriesWithCategoryName[0]?.category_id || 0}
                        defaultCategoryName={subcategoriesWithCategoryName[0]?.category_name || ''}
                        question={localProblem}
                        setModalIsOpen={setChangeSubcategoryModalIsOpen as (isOpen: boolean) => void}
                        setSubcategoriesRelatedToQuestion={setSubcategoriesWithCategoryName}
                    />
                </div>
            </Modal>
                
            <div className="p-6 text-gray-800 leading-relaxed">
                {RenderMemoWithLinks(localProblem.problem)}
            </div>

            {!showAnswer ? (
                <div className="p-6 pt-0">
                    <button 
                        className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={onShowAnswer}
                    >
                        答えを表示する
                    </button>
                </div>
            ) : (
                <div className="p-6 pt-0 border-t bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">答え</h3>
                    <div className="bg-white p-4 rounded-lg border mb-4">
                        {localProblem.answer.length > 0 ? (
                            localProblem?.answer.map((answer, index) => (
                                <div key={index} className="mb-4 last:mb-0">
                                    {answer.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                        {isLatex(line) ? (
                                            <div className="my-2">
                                                <BlockMath math={line} />
                                            </div>
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
                    
                    {localProblem.memo && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">メモ</h3>
                            <div className="bg-white p-4 rounded-lg border">
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

        <div className="flex gap-4 mt-6">
            <button 
                className="flex-1 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={onSolved}
            >
                解けた
            </button>
            <button 
                className="flex-1 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={onUnsolved}
            >
                解けなかった
            </button>
        </div>
    </div>
    )
}

