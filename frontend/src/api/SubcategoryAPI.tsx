import type { Subcategory, Subcategory2 } from '../types/Subcategory'

// ホーム画面の初期状態にて、サブカテゴリー一覧を取得するためのAPI
// 問題文検索を行った際も、以下のAPIでカテゴリー一覧を取得する
export const fetchSubcategoriesForHomePage = async (
    category_id: number,
    searchSubcategoryWord?: string,
    searchQuestionWord?: string,
    searchAnswerWord?: string
): Promise<Subcategory[]> => {
    const url = `http://localhost:8000/subcategories/category_id/${category_id}?limit=4&searchSubcategoryWord=${searchSubcategoryWord}&searchQuestionWord=${searchQuestionWord}&searchAnswerWord=${searchAnswerWord}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Failed to fetch subcategories")
    }
    const data: Subcategory2[] = await response.json()

    return data.map(({ id, name, category_id }) => ({
        id,
        name,
        categoryId: category_id,
    }))
}

export const fetchSubcategoriesByCategoryId = async (
    category_id: number
): Promise<Subcategory[]> => {
    const response = await fetch(`http://localhost:8000/subcategories/category_id/${category_id}`)
    if (!response.ok) {
        throw new Error("Failed to fetch subcategories")
    }
    const data: Subcategory2[] = await response.json()

    return data.map(({ id, name, category_id }) => ({
        id,
        name,
        categoryId: category_id,
    }))
}

export const fetchSubcategoriesByQuestionId = async (
    question_id: number
): Promise<Subcategory[]> => {
    const response = await fetch(`http://localhost:8000/subcategories/question_id/${question_id}`)
    if (!response.ok) {
        return response.json()
    }
    const data: Subcategory2[] = await response.json()

    return data.map(({ id, name, category_id }) => ({
        id,
        name,
        categoryId: category_id,
    }))
}

export const updateSubcategoryName = async (
    subcategory_id: number, 
    subcategoryName: string
) => {
    const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name: subcategoryName 
        }),
    })

    if (!response.ok) {
        throw new Error('Failed to update subcategory')
    }
}


export const fetchSubcategory = async (
    subcategory_id: number
): Promise<Subcategory2> => {
    const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`)
    if (response.ok) {
        return response.json()
    }
    throw new Error("Failed to fetch subcategory")
}

export const createSubcategory = async (
    subcategoryName: string, 
    categoryId: number
): Promise<Subcategory> => {
    const url = 'http://localhost:8000/subcategories/'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: subcategoryName, category_id: categoryId }),
    })

    if (!response.ok) {
        throw new Error('Failed to create subcategory')
    }

    const data: Subcategory2 = await response.json()

    return {
        id: data.id,
        name: data.name,
        categoryId: data.category_id,
    }
}

