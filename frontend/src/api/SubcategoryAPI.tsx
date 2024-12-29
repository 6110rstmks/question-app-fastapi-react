export const fetchSubcategories = async (category_id: number) => {
        const response = await fetch(`http://localhost:8000/subcategories/category_id/${category_id}/?limit=6`);
        if (response.ok) {
            return response.json();
        }
        throw new Error("Failed to fetch subcategories");
};