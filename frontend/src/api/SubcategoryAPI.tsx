// ホーム画面の初期状態にて、サブカテゴリー一覧を取得するためのAPI
// 問題文検索を行った際も、以下のAPIでカテゴリー一覧を取得する
export const fetchSubcategoriesForHomePage = async (
                                                    category_id: number,
                                                    searchSubcategoryWord?: string,
                                                    searchQuestionWord?: string,
                                                    searchAnswerWord?: string
                                                ) => {
    const url = `http://localhost:8000/subcategories/category_id/${category_id}?limit=4&searchSubcategoryWord=${searchSubcategoryWord}&searchQuestionWord=${searchQuestionWord}&searchAnswerWord=${searchAnswerWord}`;
    const response = await fetch(url);
    if (response.ok) {
        return response.json()
    }
}

export const fetchSubcategoriesWithQuestionCountByCategoryId = async (category_id: number, searchSubcategoryWord?: string) => {
    let url = `http://localhost:8000/subcategories/category_id/${category_id}`;
    
    if (searchSubcategoryWord) {
        url += `?searchSubcategoryWord=${searchSubcategoryWord}`;
    }
    const response = await fetch(url);

    if (response.ok) {
        return response.json()
    }
}

export const fetchSubcategoriesByQuestionId = async (question_id: number) => {
    const response = await fetch(`http://localhost:8000/subcategories/question_id/${question_id}`);
    if (response.ok) {
        return response.json()
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
    })

    if (!response.ok) {
        throw new Error('Failed to update subcategory');
    }
}

export const fetchSubcategory = async (subcategory_id: number) => {
    const response = await fetch(`http://localhost:8000/subcategories/${subcategory_id}`);
    if (response.ok) {
        return response.json()
    }
};

export const createSubcategory = async (subcategoryName: string, categoryId: number) => {
    const url = 'http://localhost:8000/subcategories/'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: subcategoryName, category_id: categoryId }),
    });

    return response
}

export const fetchSubcategoriesWithCategoryNameByCategoryId = async (category_id: number) => {
    const response = await fetch(`http://localhost:8000/subcategories/WithCategoryName/category_id/${category_id}`);
    if (response.ok) {
        return response.json()
    }
}

export const fetchSubcategoriesWithCategoryNameByQuestionId = async (question_id: number) => {
    const response = await fetch(`http://localhost:8000/subcategories/WithCategoryName/question_id/${question_id}`);
    if (response.ok) {
        return response.json()
    }
}

export const fetchSubcategoryWithCategoryNameById = async (subcategory_id: number) => {
    const response = await fetch(`http://localhost:8000/subcategories/WithCategoryName/id/${subcategory_id}`);
    if (response.ok) {
        return response.json()
    }
}