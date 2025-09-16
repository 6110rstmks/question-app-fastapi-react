import React, { useState } from 'react'
import { useNavigate } from "react-router"
import type { Category } from "../../types/Category"
import type { SubcategoryWithQuestionCount } from "../../types/Subcategory"
import { useCategoryBox } from "./hooks/useCategoryBox"
import { 
    handleNavigateToCategoryPage, 
    handleNavigateToSubcategoryPage 
} from '../../utils/navigate_function'
import { Plus, Pin, PinOff, ChevronRight, Folder, Hash, Eye } from 'lucide-react'


interface CategoryBoxProps {
    category: Category,
    searchSubcategoryWord: string,
    searchQuestionWord: string,
    searchAnswerWord: string
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    category,
    searchSubcategoryWord,
    searchQuestionWord,
    searchAnswerWord
}) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [isPinned, setIsPinned] = useState<boolean>(false)

    const { 
        subcategoriesWithQuestionCount,
        inputSubcategoryName,
        setInputSubcategoryName,
        handleAddSubcategory,
        categoryBoxRef
    } = useCategoryBox({
        categoryId: category.id,
        showForm,
        setShowForm,
        searchSubcategoryWord,
        searchQuestionWord,
        searchAnswerWord
    })
    const totalQuestions = subcategoriesWithQuestionCount.reduce((sum, sub) => sum + sub.question_count, 0);

    const navigate = useNavigate()

    return (
        <div 
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            key={category.id} 
            ref={categoryBoxRef}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Pin Button */}
                        <button 
                            onClick={() => setIsPinned(!isPinned)}
                            className={`p-2 rounded-full transition-all duration-200 ${
                                isPinned 
                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                            }`}
                        >
                            {isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                        </button>
                        
                        {/* Category Icon and Name */}
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Folder className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 
                                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => handleNavigateToCategoryPage(navigate, category)}
                            >
                                {category.name}
                            </h3>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Subcategory Count */}
                        <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                            <Hash className="h-3 w-3 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                                {subcategoriesWithQuestionCount.length}
                            </span>
                        </div>
                        
                        {/* Total Questions */}
                        <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                            <span className="text-sm font-medium text-green-700">
                                {totalQuestions}問
                            </span>
                        </div>
                        
                        {/* Add Button */}
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className={`p-2 rounded-full transition-all duration-200 ${
                                showForm
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200 rotate-45'
                                    : 'bg-green-100 text-green-600 hover:bg-green-200 hover:scale-110'
                            }`}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="p-4 bg-gray-50 border-b border-gray-100 animate-in slide-in-from-top duration-200">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            サブカテゴリー名
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={inputSubcategoryName} 
                                onChange={(e) => setInputSubcategoryName(e.target.value)} 
                                autoFocus
                                placeholder="新しいサブカテゴリを入力..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
                            />
                            <button 
                                onClick={handleAddSubcategory}
                                disabled={!inputSubcategoryName.trim()}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                追加
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Subcategories List */}
            <div className="p-4">
                <div className="space-y-2">
                    {subcategoriesWithQuestionCount.slice(0, showForm ? subcategoriesWithQuestionCount.length : 4).map((subcategory: SubcategoryWithQuestionCount) => (
                        <div key={subcategory.id} className="group/item">
                            <div
                                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200"
                                onClick={() => handleNavigateToSubcategoryPage(navigate, category, subcategory.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-blue-100 rounded-md group-hover/item:bg-blue-200 transition-colors">
                                        <ChevronRight className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium group-hover/item:text-blue-700 transition-colors">
                                        {subcategory.name}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-200 group-hover/item:border-blue-200 transition-colors">
                                        <span className="text-sm font-medium text-gray-600 group-hover/item:text-blue-600">
                                            {subcategory.question_count || 0}
                                        </span>
                                        <span className="text-xs text-gray-500">問</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* See More Button */}
            {subcategoriesWithQuestionCount.length >= 4 && !showForm && (
                <div className="px-4 pb-4">
                    <button 
                        onClick={() => handleNavigateToCategoryPage(navigate, category)} 
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                    >
                        <Eye className="h-4 w-4" />
                        もっと見る ({subcategoriesWithQuestionCount.length - 4}件)
                    </button>
                </div>
            )}
        </div>
    );
}

export default CategoryBox;
