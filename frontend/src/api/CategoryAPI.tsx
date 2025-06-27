import { Category, CategoryWithQuestionCount } from '../types/Category';

interface FetchCategoriesParams {
    skip: number;
    limit: number;
    searchCategoryWord: string;
    searchSubcategoryWord: string;
    searchQuestionWord: string;
    searchAnswerWord: string;
}

export const fetchAllCategories = async (): Promise<Category[]> => {
    const url = 'http://localhost:8000/categories/all_categories';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return await response.json()
}

// ホーム画面の初期状態にて、カテゴリー一覧を取得するためのAPI
// カテゴリ検索を行った際も、以下のAPIでカテゴリー一覧を取得する
export const fetchCategories = async ({
    skip,
    limit,
    searchCategoryWord,
    searchSubcategoryWord,
    searchQuestionWord,
    searchAnswerWord
}: FetchCategoriesParams): Promise<Category[]> => {
    const url = `http://127.0.0.1:8000/categories/home?skip=${skip}&limit=${limit}&categoryWord=${searchCategoryWord}&subcategoryWord=${searchSubcategoryWord}&questionWord=${searchQuestionWord}&answerWord=${searchAnswerWord}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.json();
};

// ChangeCategorySubcategoryModalで使用するAPI
export const fetchCategoriesBySearchWord = async (
    searchWord: string
): Promise<Category[]> => {
    const url = `http://localhost:8000/categories/search?search_word=${searchWord}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// Questionに紐づくCategoryを取得するAPI
// 問題出題画面にて使用する。
export const fetchCategoryByQuestionId = async (question_id: number): Promise<Category> => {
    const url = `http://localhost:8000/categories/question_id/${question_id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// questionを一つでも持つcategoryをすべて取得
// 問題出題画面にて使用する。
export const fetchAllCategoriesWithQuestions = async (): Promise<CategoryWithQuestionCount[]> => {
    const url = 'http://localhost:8000/categories/all_categories_with_questions'
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await response.json()
}

// ページネーションのページ数を取得
export const fetchPageCount = async (): Promise<number> => {
    const url = `http://127.0.0.1:8000/categories/page_count`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.json();
};

export const fetchCategory = async (category_id: number): Promise<Category> => {
    const url = `http://localhost:8000/categories/category_id/${category_id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return await response.json();
}

export const createCategory = async (categoryName: string): Promise<Response> => {
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

