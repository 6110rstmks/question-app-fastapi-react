import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router"
import type { SubcategoryWithQuestionCount } from '../../types/Subcategory'
import { useCategoryPage } from "./hooks/useCategoryPage";
import { handleNavigateToSubcategoryPage } from '../../utils/navigate_function'

const CategoryPage: React.FC = () => {
    const { categoryId: categoryIdStr } = useParams<{ categoryId: string }>() 
    const categoryId = Number(categoryIdStr)
    const { 
        category,
        subcategories,
        subcategoryName,
        uncorrectedQuestionCount,
        temporaryQuestionCountFifteenDaysAgo,
        correctedQuestionCountOrderThanOneMonth,
        questionCount,
        setSubcategoryName,
        searchWord,
        handleAddSubcategory,
        handleSearch,
        handleSetUnsolvedProblem,
        handleSetTemporaryProblem,
        handleSetSolvedProblem
    } = useCategoryPage(categoryId)

    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* ヘッダーセクション */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        {category?.name} 
                        <span className="ml-3 text-lg font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {questionCount}問
                        </span>
                    </h2>
                    
                    {/* 問題出題ボタン群 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <button 
                            onClick={handleSetUnsolvedProblem}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
                        >
                            <div className="text-sm">未正解の問題から出題</div>
                            <div className="text-lg font-bold">({uncorrectedQuestionCount}問)</div>
                        </button>
                        
                        <button 
                            onClick={handleSetTemporaryProblem}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
                        >
                            <div className="text-sm">15日前のTempから出題</div>
                            <div className="text-lg font-bold">({temporaryQuestionCountFifteenDaysAgo}問)</div>
                        </button>
                        
                        <button 
                            onClick={handleSetSolvedProblem}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
                        >
                            <div className="text-sm">1ヶ月前のCorrectから出題</div>
                            <div className="text-lg font-bold">({correctedQuestionCountOrderThanOneMonth}問)</div>
                        </button>
                    </div>
                    
                    <button className="w-full md:w-auto bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
                        問題文から調べる
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* サブカテゴリー追加セクション */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            サブカテゴリーの追加
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                                    サブカテゴリー名
                                </label>
                                <input
                                    id="subcategory"
                                    type="text"
                                    value={subcategoryName}
                                    onChange={(e) => setSubcategoryName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    placeholder="新しいサブカテゴリー名を入力"
                                />
                            </div>
                            <button
                                onClick={handleAddSubcategory}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
                            >
                                追加する
                            </button>
                        </div>
                    </div>

                    {/* 検索セクション */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                            サブカテゴリー検索
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pl-10"
                                value={searchWord}
                                onChange={handleSearch}
                                placeholder="サブカテゴリーを検索..."
                                autoFocus
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* サブカテゴリーリスト */}
                <div className="mt-6 bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">サブカテゴリー一覧</h3>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subcategories.map((subcategory: SubcategoryWithQuestionCount) => (
                                <div 
                                    key={subcategory.id}
                                    onClick={() => category && handleNavigateToSubcategoryPage(navigate, category, subcategory.id)}
                                    className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 cursor-pointer transition duration-200 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-blue-600 group-hover:text-blue-700">•</span>
                                            <span className="font-medium text-gray-800 group-hover:text-blue-800 truncate">
                                                {subcategory.name}
                                            </span>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full shrink-0 ml-2">
                                            {subcategory.questionCount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {subcategories.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">サブカテゴリーが見つかりません</div>
                                <div className="text-gray-500 text-sm">新しいサブカテゴリーを追加してください</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryPage