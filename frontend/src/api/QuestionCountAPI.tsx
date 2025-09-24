
// すべてのQuestionの数を取得するAPI
export const fetchQuestionCount = async (
): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count'
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

//  カテゴリ内のQuestionの数を取得するAPI
export const fetchQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = `http://localhost:8000/question_count/count/category_id/${category_id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

//  サブカテゴリ内のQuestionの数を取得するAPI
export const fetchQuestionCountBySubcategoryId = async (
    subcategory_id: number
): Promise<number> => {
    const url = `http://localhost:8000/question_count/count/subcategory_id/${subcategory_id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// ------------------------------------------------------------------------ #
    // Corrected
// ------------------------------------------------------------------------ #

export const fetchCorrectedQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/corrected'
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// 特定のカテゴリ内のx日前より前に解いた正解のQuestionの数を取得するAPI
export const fetchCorrectedQuestionCountByCategoryIdOrderThanXDays = async (
    category_id: number,
    x_days: number
): Promise<number> => {
    const url = `http://localhost:8000/question_count/count/corrected/category_id/${category_id}/order_than_x_days/${x_days}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return await response.json()
}

// 特定のカテゴリ内の1ヶ月前より前に解いた正解のQuestionの数を取得するAPI
export const fetchCorrectedQuestionCountByCategoryIdOrderThanOneMonth = async (
    category_id: number
): Promise<number> => {
    const url = `http://localhost:8000/question_count/count/corrected/category_id/${category_id}/order_than_one_month`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return await response.json()
}

// 特定のカテゴリ内の正解のQuestionの数を取得するAPI
export const fetchCorrectedQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/is_correct/category_id/'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category_id: category_id,
            is_correct: 2  // 2は正解を表す
        })
    })
    return await response.json()
}

// ------------------------------------------------------------------------ #
    // Temporary
// ------------------------------------------------------------------------ #

export const fetchTemporaryQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/temporary/'
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json()
    return data
}

// 特定のカテゴリ内のTemporaryのQuestionの数を取得するAPI
export const fetchTemporaryQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/is_correct/category_id/'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category_id: category_id,
            is_correct: 1  // 1はTemporaryを表す
        })
    })
    return await response.json()
}

export const fetchTemporaryQuestionCountBySubcategoryId = async (
    subcategory_id: number
): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/is_correct/subcategory_id/'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subcategory_id: subcategory_id,
            is_correct: 1  // 1はTemporaryを表す
        })
    })
    return await response.json()
}

export const fetchTemporaryQuestionCountByCategoryIdOrderThanXDays = async (
    category_id: number,
    x_days: number
): Promise<number> => {
    const url = `http://localhost:8000/question_count/count/temporary/category_id/${category_id}/order_than_x_days/${x_days}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// ------------------------------------------------------------------------ #
    // Uncorrected
// ------------------------------------------------------------------------ #


export const fetchUncorrectedQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/uncorrected'
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    
    return await response.json()
}

// 特定のカテゴリ内の不正解のQuestionの数を取得するAPI
export const fetchUncorrectedQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/is_correct/category_id/'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category_id: category_id,
            is_correct: 0  // 0は不正解を表す
        })
    })
    return await response.json()
}

// 特定のサブカテゴリ内の不正解のQuestionの数を取得するAPI
export const fetchUncorrectedQuestionCountBySubcategoryId = async (
    subcategory_id: number
): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/is_correct/subcategory_id/'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subcategory_id: subcategory_id,
            is_correct: 0  // 0は不正解を表す
        })
    })
    return await response.json()
}