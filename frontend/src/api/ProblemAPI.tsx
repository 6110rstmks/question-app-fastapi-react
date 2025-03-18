export const fetchProblem = async (
    selectedType: string,
    incorrectedOnlyFlgChecked: boolean,
    problemCnt: number,
    selectedCategoryIds: number[]
) => {
    const url = 'http://localhost:8000/problems/generate_problems'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            type: selectedType,
            incorrected_only_flg: incorrectedOnlyFlgChecked,
            problem_cnt: problemCnt,
            category_ids: selectedCategoryIds
        }),
    });

    return response
}
