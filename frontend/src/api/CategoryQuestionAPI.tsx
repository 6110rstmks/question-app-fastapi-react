export const fetchCategoryQuestionByQuestionId = async (question_id: number) => {
    const url = `http://localhost:8000/categories_questions/question_id/${question_id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return await response.json()
}

