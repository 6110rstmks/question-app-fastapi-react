import { useState, useEffect, useRef } from 'react';
import { SubcategoryWithQuestionCount } from "../../../types/Subcategory";
import { fetchSubcategoriesForHomePage, createSubcategory } from "../../../api/SubcategoryAPI";


export const useSetProblemPage = (
    categoryId: number,
    showForm: boolean,
    setShowForm: (showForm: boolean) => void,
    searchSubcategoryWord: string,
    searchQuestionWord: string,
    searchAnswerWord: string
) => {
    
}