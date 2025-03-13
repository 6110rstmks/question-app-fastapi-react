import React, { useState } from 'react';
import { QuestionWithCategoryIdAndCategoryNameAndSubcategoryId } from '../../../types/Question';
import { fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord, fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByAnswerWord } from '../../../api/QuestionAPI';
import { fetchCategory } from '../../../api/CategoryAPI';
import { fetchSubcategoriesQuestionsByQuestionId } from '../../../api/SubcategoryQuestionAPI';
import { fetchCategoryQuestionByQuestionId } from '../../../api/CategoryQuestionAPI';


export const useQuestionListPage = () => {
    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [searchAnswerWord, setSearchAnswerWord] = useState<string>("")
    const [questions , setQuestions] = useState<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]>([])

    const handleProblemSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProblemWord(e.target.value)
    }

    const handleAnswerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(1)
        setSearchAnswerWord(e.target.value)
    }

    const handleProblemSearchClick = async () => {
        if (searchProblemWord.trim() === "") return;
        const questions_data: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] = await fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord(searchProblemWord)
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

    const handleAnswerSearchClick = async () => {
        if (searchAnswerWord.trim() === "") return;
        const questions_data: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] = await fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByAnswerWord(searchAnswerWord)
        setQuestions(questions_data)
    }
    
    return {
        questions,
        handleProblemSearch,
        handleAnswerSearch,
        handleProblemSearchClick,
        handleAnswerSearchClick
    }
}