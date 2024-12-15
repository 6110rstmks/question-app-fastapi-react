// Questionに紐づくCategoryを取得するAPI
export const getCategoryByQuestionId = async (question_id: number) => {
    const response = await fetch(`http://localhost:8000/questions/get_category/${question_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json()
    return data
}

// Questionに紐づくSubcategoryを取得するAPI
export const getSubcategoryByQuestionId = async (question_id: number) => {
    const response = await fetch(`http://localhost:8000/questions/get_subcategory/${question_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json()
    return data
}