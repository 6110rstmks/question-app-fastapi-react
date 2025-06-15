import React, { useEffect, useState } from 'react'
import { fetchAllCategories } from '../api/CategoryAPI'
import { Category } from '../types/Category'
import styles from "./CategoryList.module.css"

const CategoryListPage = () => {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data: Category[] = await fetchAllCategories()
            setCategories(data)
    }
        fetchData()
    }, [])
  return (
    <div>
        <h1>カテゴリのブラックリスト一覧</h1>
        <div>
            {categories.map((category) => (
                // チェックボックスを表示する
                <div key={category.id} className={styles.categoryBox}>
                    <input type="checkbox" name="" id="" />
                    <h2>{category.name}</h2>
                </div>
            ))}
        </div>
    </div>
  )
}

export default CategoryListPage