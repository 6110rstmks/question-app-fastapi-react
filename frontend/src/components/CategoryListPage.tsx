import React, { useEffect, useState } from 'react'
import { fetchAllCategories } from '../api/CategoryAPIA'
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
        <table>
            <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Country</th>
            </tr>
            <tr>
                <td>Alfreds Futterkiste</td>
                <td>Maria Anders</td>
                <td>Germany</td>
            </tr>
            <tr>
                <td>Centro comercial Moctezuma</td>
                <td>Francisco Chang</td>
                <td>Mexico</td>
            </tr>
        </table>
        <h1>カテゴリのリスト一覧</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>カテゴリ名</th>
                    <th>ブラックチェっく</th>
                </tr>
            </thead>
        </table>
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