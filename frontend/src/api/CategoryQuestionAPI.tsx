export const fetchCategoryQuestionsByQuestionId = async (question_id: number) => {
    const url = `http://localhost:8000/category_questions/${question_id}`
    const response = await fetch(url)
    if (response.ok) {
        return await response.json()
    }
}