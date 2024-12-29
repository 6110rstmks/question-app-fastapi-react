export const fetchSubcategories = async (category_id: number) => {
    const url = `http://localhost:8000/subcategories/category_id/${category_id}/?limit=6`;
    const response = await fetch(url);
    if (response.ok) {
        return response.json();
    }
    throw new Error("Failed to fetch subcategories");
};