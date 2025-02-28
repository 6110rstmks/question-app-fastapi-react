// ホーム画面の初期状態にて、カテゴリー一覧を取得するためのAPI
// カテゴリ検索を行った際も、以下のAPIでカテゴリー一覧を取得する
export const fetchCategories = async (skip: number, limit: number, searchCategoryWord: string, searchSubcategoryWord: string, searchQuestionWord: string, searchAnswerWord: string) => {
    const url = `http://127.0.0.1:8000/categories/home?skip=${skip}&limit=${limit}&categoryWord=${searchCategoryWord}&subcategoryWord=${searchSubcategoryWord}&questionWord=${searchQuestionWord}&answerWord=${searchAnswerWord}`;
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    }
};

// Questionに紐づくCategoryを取得するAPI
export const fetchCategoryByQuestionId = async (question_id: number) => {
    const response = await fetch(`http://localhost:8000/questions/get_category/${question_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// questionを一つでも持つcategoryをすべて取得
// 問題出題画面にて使用する。
export const fetchAllCategoriesWithQuestions = async () => {
    const url = 'http://localhost:8000/categories/all_categories_with_questions'
    const response = await fetch(url)
    if (response.ok) {
        return await response.json()
    }
}

// ページネーションのページ数を取得
export const fetchPageCount = async () => {
    const url = `http://127.0.0.1:8000/categories/page_count`;
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    }
    throw new Error("Failed to fetch page count");
};

export const fetchCategory = async (category_id: number) => {
    const url = `http://localhost:8000/categories/category_id/${category_id}`
    const response = await fetch(url)
    if (response.ok) {
        return await response.json();
    }
}

export const createCategory = async (categoryName: string) => {
    const url = 'http://localhost:8000/categories'
    const response = await fetch('http://localhost:8000/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
    });

    return response
}
