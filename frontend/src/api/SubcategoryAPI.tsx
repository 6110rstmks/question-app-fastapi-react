// ホーム画面の初期状態にて、サブカテゴリー一覧を取得するためのAPI
// 問題文検索を行った際も、以下のAPIでカテゴリー一覧を取得する
// export const fetchSubcategoriesForHomePage = async (category_id: number, searchSubcategoryWord: string) => {
export const fetchSubcategoriesForHomePage = async (category_id: number,
                                                    searchSubcategoryWord?: string,
                                                    searchQuestionWord?: string,
                                                    searchAnswerWord?: string
                                                ) => {
    const url = `http://localhost:8000/subcategories/category_id/${category_id}?limit=6&searchSubcategoryWord=${searchSubcategoryWord}&searchQuestionWord=${searchQuestionWord}&searchAnswerWord=${searchAnswerWord}`;
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    }
    throw new Error("Failed to fetch subcategories");
}

export const fetchSubcategoriesByCategoryId = async (category_id: number, searchSubcategoryWord?: string) => {
    let url = `http://localhost:8000/subcategories/category_id/${category_id}`;
    
    if (searchSubcategoryWord) {
        url += `?subcategoryWord=${encodeURIComponent(searchSubcategoryWord)}`;
    }

    const response = await fetch(url);

    if (response.ok) {
        return response.json();
    }
}

export const fetchSubcategoriesByQuestionId = async (question_id: number) => {
    const response = await fetch(`http://localhost:8000/subcategories/question_id/${question_id}`);
    if (response.ok) {
        return response.json();
    }
    throw new Error("Failed to fetch subcategory");
}

export const updateSubcategoryName = async (subcategory_id: number, subcategoryName: string) => {
    const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name: subcategoryName 
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update subcategory');
    }
};

export const fetchSubcategory = async (subcategory_id: number) => {
    const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`);
    if (response.ok) {
        return response.json()
    }
};