export const fetchTemporaryQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/temporary'
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    console.log('Temporary Question Count:', await response.json())
    return await response.json()
}


// すべてのQuestionの数を取得するAPI
export const fetchQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

export const fetchCorrectedQuestionCount = async (): Promise<number> => {
    const url = 'http://localhost:8000/question_count/count/corrected';
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
    const url = `http://localhost:8000/question_count/count/corrected/category_id/${category_id}/order_than_one_month`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return await response.json()
}


// 特定のカテゴリ内のTemporaryのQuestionの数を取得するAPI
export const fetchTemporaryQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = `http://localhost:8000/question_count/count/temporary/category_id/${category_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 特定のカテゴリ内の正解のQuestionの数を取得するAPI
export const fetchCorrectedQuestionCountByCategoryId = async (
    category_id: number
): Promise<number> => {
    const url = `http://localhost:8000/questions/count/corrected/category_id/${category_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// すべての不正解のQuestionの数を取得するAPI
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
    const url = `http://localhost:8000/question_count/count/uncorrected/category_id/${category_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}

// 特定のサブカテゴリ内の不正解のQuestionの数を取得するAPI
export const fetchUncorrectedQuestionCountBySubcategoryId = async (
    subcategory_id: number
): Promise<number> => {
    const url = `http://localhost:8000/question_count/count/uncorrected/subcategory_id/${subcategory_id}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json();
}