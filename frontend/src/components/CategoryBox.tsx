import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"

export interface Category {
    id: number;
    name: string;
}

export interface Subcategory {
    id: number;
    name: string;
    category_id: number;
}

interface CategoryBoxProps {
    category: Category
}
const CategoryBox: React.FC<CategoryBoxProps> = ({ category }) => {
    const [subcategoriesList, setSubcategoriesList] = useState<Subcategory[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [subCategoryName, setCategoryName] = useState('');

    const navigate = useNavigate();

    const handleClick = () => {
        setShowForm(!showForm);
    }

    const createSubCategory = async () => {
        const response = await fetch('http://localhost:8000/subcategories/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: subCategoryName, category_id: category.id }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to create subcategory');
          }
    
        const data: Subcategory = await response.json();
        setSubcategoriesList((prev) => [...prev, data]);
        setCategoryName('');
        
    }

    const handleSubcategoryClick = (subcategory_id: number) => {
        navigate(`/subcategory/${subcategory_id}`, { state: category.id });
      };

    useEffect(() => {
        const fetchSubcategories = async () => {
            const response = await fetch(`http://localhost:8000/subcategories/category_id/${category.id}`);
            if (response.ok) {
                const data: Subcategory[] = await response.json();
                setSubcategoriesList(data);
            }
        };

        fetchSubcategories();
    }, [category.id]); 

    return (
        <div className="postContents" key={category.id}>
            <div className="category-name">{category.id}：{category.name}</div>
            <div onClick={handleClick}>➕</div>
            {showForm && (
                <>
                    <label>
                        サブカテゴリー名:
                        <input type="text" value={subCategoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    </label>
                    <button onClick={createSubCategory}>Submit</button>
                </>
            )}
            {subcategoriesList.map((subcategory) => (
                <div className="subcategory-name" key={subcategory.id} onClick={() => handleSubcategoryClick(subcategory.id)}>●{subcategory.name}</div>
            ))}
        </div>
    );
}

export default CategoryBox;
