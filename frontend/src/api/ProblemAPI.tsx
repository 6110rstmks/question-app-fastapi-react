export const fetchProblem = async (
    selectedType: string,
    solvedStatus: string[],
    problemCnt: number,
    selectedCategoryIds?: number[],
    selectedSubcategoryIds?: number[]
) => {
    const url = 'http://localhost:8000/problems/'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            type: selectedType,
            solved_status: solvedStatus,
            problem_cnt: problemCnt,
            category_ids: selectedCategoryIds,
            subcategory_ids: selectedSubcategoryIds
        }),
    })

    // return response.json()
    return response
}

export const fetchProblemByDay = async (
    day: string
) => {
    const url = `http://localhost:8000/problems/day/${day}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create problems');
    }

    return response.json()
}