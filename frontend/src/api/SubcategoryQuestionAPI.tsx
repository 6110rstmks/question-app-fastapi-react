export const fetchSubcategoryQuestionsByQuestionId = async (question_id: number) => {
    const url = `http://localhost:8000/subcategory_questions/${question_id}`
    const response = await fetch(url)
    if (response.ok) {
        return await response.json()
    }
}