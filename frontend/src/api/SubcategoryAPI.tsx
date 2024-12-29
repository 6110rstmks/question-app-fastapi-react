export const fetchSubcategoriesForHomePage = async (category_id: number) => {
    const url = `http://localhost:8000/subcategories/category_id/${category_id}/?limit=6`;
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    }
    throw new Error("Failed to fetch subcategories");
};

export const fetchSubcategories = async (category_id: number) => {
    const response = await fetch(`http://localhost:8000/subcategories/category_id/${category_id}/`);
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