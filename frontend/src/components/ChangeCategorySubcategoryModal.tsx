import React from 'react'
import type { SubcategoryWithCategoryName } from '../types/Subcategory'
import type { Question } from '../types/Question'
import { SolutionStatus } from '../types/SolutionStatus'
import { Search, X, ChevronRight, Tag, Folder } from 'lucide-react';

import useChangeCategorySubcategoryModal from './useChangeCategorySubcategoryModal'

interface ChangeCategorySubcategoryProps {
    categoryId: number;
    defaultCategoryName: string;
    question?: Question;
    setModalIsOpen: (isOpen: boolean) => void;
    setSubcategoriesRelatedToQuestion: (subcategories: SubcategoryWithCategoryName[]) => void;
}


const ChangeCategorySubcategoryModal: React.FC<ChangeCategorySubcategoryProps> = ({
    categoryId,
    defaultCategoryName,
    question,
    setModalIsOpen,
    setSubcategoriesRelatedToQuestion,
}) => {

    const {
        searchWord,
        searchFlg,
        categories,
        displayedCategoryName,
        linkedSubcategories,
        subcategoriesWithCategoryName,
        selectedSubcategoryIds,
        handleCheckboxChange,
        handleClickCategoryName,
        handleSearch,
        handleChangeBelongingToSubcategory,
    } = useChangeCategorySubcategoryModal(
        categoryId, 
        defaultCategoryName, 
        question ?? { 
            id: 0, 
            problem: "", 
            answer: [], 
            memo: "", 
            is_correct: SolutionStatus.Incorrect,  // 修正：`false`ではなく`SolutionStatus.NOT_SOLVED`に変更
            answer_count: 0 ,
            last_answered_date: ""
        },  
        setModalIsOpen, 
        setSubcategoriesRelatedToQuestion
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Folder className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">カテゴリ・サブカテゴリの変更</h2>
                    </div>
                    <button 
                        onClick={() => setModalIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex h-[600px]">
                    {/* Left Panel */}
                    <div className="w-1/2 p-6 border-r border-gray-200 bg-gray-50/50">
                        {/* Search Section */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                カテゴリ名を検索する
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input 
                                    type="text"
                                    onChange={handleSearch}
                                    value={searchWord}
                                    autoFocus
                                    placeholder="カテゴリを検索..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            
                            {/* Category List */}
                            <div className="mt-4 max-h-48 overflow-y-auto bg-white rounded-lg border border-gray-200">
                                {categories?.map((category) => (
                                    <div 
                                        key={category.id} 
                                        onClick={() => handleClickCategoryName(category)}
                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-3"
                                    >
                                        <Tag className="h-4 w-4 text-blue-500" />
                                        <span className="text-gray-700 font-medium">{category.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Current Categories Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                現在の所属カテゴリ・サブカテゴリ
                            </h3>
                            <div className="space-y-3">
                                {linkedSubcategories?.map((linkedSubcategory) => (
                                    <div 
                                        key={linkedSubcategory.id}
                                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-200 shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium text-gray-800 bg-green-50 px-3 py-1 rounded-full">
                                                {linkedSubcategory.category_name}
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                                {linkedSubcategory.name}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="w-1/2 p-6">
                        <div className="h-full flex flex-col">
                            {/* Selected Category Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                                    <Folder className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-semibold text-indigo-900">
                                        {!searchFlg ? defaultCategoryName : displayedCategoryName}
                                    </h3>
                                </div>
                            </div>

                            {/* Subcategory List */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="space-y-3">
                                    {subcategoriesWithCategoryName.map((subcategoryWithCategoryName) => (
                                        <label 
                                            key={subcategoryWithCategoryName.id}
                                            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all group"
                                        >
                                            <input
                                                type="checkbox"
                                                name="subcategory"
                                                value={JSON.stringify(subcategoryWithCategoryName)} 
                                                checked={selectedSubcategoryIds.includes(subcategoryWithCategoryName.id)}
                                                onChange={handleCheckboxChange}
                                                className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                                                <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                                                    {subcategoryWithCategoryName.name}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <button 
                                    onClick={handleChangeBelongingToSubcategory}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                >
                                    変更を適用する
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeCategorySubcategoryModal