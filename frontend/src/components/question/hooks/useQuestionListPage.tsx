import React, { useState, useCallback, useEffect } from 'react';
import { QuestionWithCategoryIdAndCategoryNameAndSubcategoryId } from '../../../types/Question';
import { 
    fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord, 
    fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByAnswerWord 
} from '../../../api/QuestionAPI'
import { fetchCategory } from '../../../api/CategoryAPI'
import { fetchSubcategoriesQuestionsByQuestionId } from '../../../api/SubcategoryQuestionAPI'
import { fetchCategoryQuestionByQuestionId } from '../../../api/CategoryQuestionAPI'
import { useNavigate } from "react-router"

export const useQuestionListPage = () => {
    const [searchProblemWord, setSearchProblemWord] = useState<string>("")
    const [searchAnswerWord, setSearchAnswerWord] = useState<string>("")
    const [questions , setQuestions] = useState<QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[]>([])
    const navigate = useNavigate()

    // サイト内ショートカットキーの設定
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.key.toLowerCase() === 'k' &&
            event.metaKey // macOSでcommandキーまたはCapsLockキーを表す
        ) {            
            event.preventDefault()
            navigate('/')
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        };
    }, [handleKeyDown])

    const handleProblemSearchClick = async () => {
        if (searchProblemWord.trim() === "") return

        const questions_data: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] =
        await fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByProblemWord(
          searchProblemWord
        )

        setSearchAnswerWord(searchProblemWord)

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
        const questions_data: QuestionWithCategoryIdAndCategoryNameAndSubcategoryId[] = 
        await fetchQuestionsWithCategoryIdAndCategoryNameAndSubcategoryIdByAnswerWord(searchAnswerWord)

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
        searchAnswerWord,
        setSearchProblemWord,
        setSearchAnswerWord,
        handleProblemSearchClick,
        handleAnswerSearchClick
    }
}