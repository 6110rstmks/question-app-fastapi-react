import { format } from 'date-fns'
import type { Question } from '../types/Question'

/**
 * Fetches a list of problems based on type, solved status, count, and optional category filters.
 *
 * @param selectedType - The type of problems to fetch ('category', 'subcategory', 'random').
 * @param solvedStatus - The solved status filter ('correct', '', 'temporary').
 * @param problemCount - The number of problems to retrieve.
 * @param selectedCategoryIds - (Optional) Array of category IDs to filter problems.
 * @param selectedSubcategoryIds - (Optional) Array of subcategory IDs to filter problems.
 * @returns A Promise resolving to the fetch Response object.
 */

export const fetchProblem = async (
    selectedType: "category" | "subcategory" | "random",
    solvedStatus: "correct" | "temporary" | "incorrect",
    problemCount: number,
    selectedCategoryIds?: number[],
    selectedSubcategoryIds?: number[]
): Promise<Question[]> => {
    const url = 'http://localhost:8000/problems/'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            type: selectedType,
            solved_status: solvedStatus,
            problem_count: problemCount,
            category_ids: selectedCategoryIds,
            subcategory_ids: selectedSubcategoryIds
        }),
    })
    return response.json()
}

/**
 * Fetches problems created on a specific day.
 *
 * @param day - A Date object representing the day for which to fetch problems.
 * @returns A Promise resolving to the parsed JSON response containing problems for the given day.
 * @throws Will throw an Error if the response status is not OK.
 */

export const fetchProblemByDay = async (
    day: Date
):Promise<Question[]> => {
    const dateStr = format(day, 'yyyy-MM-dd');

    const url = `http://localhost:8000/problems/day/${dateStr}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return response.json()
}