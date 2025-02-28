import React, { useState, useEffect } from 'react';
import { QuestionWithCategoryIdAndCategoryNameAndSubcategoryId } from '../types/Question';
import { fetchQuestionsBySearchProblemWord } from '../api/QuestionAPI';
import { fetchCategory } from '../api/CategoryAPI';
import { fetchSubcategoriesQuestionsByQuestionId } from '../api/SubcategoryQuestionAPI';
import { fetchCategoryQuestionByQuestionId } from '../api/CategoryQuestionAPI';


export const useQuestionListPage = () => {
    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [questions , setQuestions] = useState<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]>([])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProblemWord(e.target.value)
    }

    const handleSearchClick = async () => {
        if (searchProblemWord.trim() === "") return;
        const questions_data: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] = await fetchQuestionsBySearchProblemWord(searchProblemWord)
        for (let i = 0; i < questions_data.length; i++) {
            const category_id = (await fetchCategoryQuestionByQuestionId(questions_data[i].id)).category_id
            const category = await fetchCategory(category_id)
            const subcategory_id = (await fetchSubcategoriesQuestionsByQuestionId(questions_data[i].id))[0].subcategory_id
            questions_data[i].category_name = category.name
            questions_data[i].categoryId = category_id
            questions_data[i].subcategoryId = subcategory_id
        }
        setQuestions(questions_data)
    }
    
    return {
        questions,
        handleSearch,
        handleSearchClick 
    }
}