// ホーム画面の初期状態にて、カテゴリー一覧を取得するためのAPI
// カテゴリ検索を行った際も、以下のAPIでカテゴリー一覧を取得する
export const fetchCategories = async (skip: number, limit: number, searchWord: string) => {
    const url = `http://127.0.0.1:8000/categories/home?skip=${skip}&limit=${limit}&word=${searchWord}`;
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    }
    throw new Error("Failed to fetch categories");
};

// questionを一つでも持つcategoryをすべて取得
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