import React, { useState } from "react"
import { useCategories } from "../hooks/useCategories"
import { CategoryList } from "./category/CategoryList"
import Pagination from "./Pagination"
import { Link } from "react-router"
import Search from "./Search"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import { checkAuth } from "../api/AuthAPI"
import { useNavigate } from "react-router"

export const HomePage: React.FC = () => {
    const [page, setPage] = useState<number>(1)
    const [limit] = useState<number>(3)
    const { setIsAuth } = useAuth()
    const navigate = useNavigate()

    useEffect(()  => {
        (async () => {
            const response = await checkAuth();
            if (response.ok) {
                setIsAuth(true);
            }
            else {
                setIsAuth(false);
                navigate("/login")
            }
        })()

    }, []);

    const [
        searchCategoryWord, 
        setSearchCategoryWord
    ] = useState<string>("")

    const [
        searchSubcategoryWord,
        setSearchSubcategoryWord
    ] = useState<string>("")

    const [
        searchQuestionWord, 
        setSearchQuestionWord
    ] = useState<string>("")

    const [
        searchAnswerWord, 
        setSearchAnswerWord
    ] = useState<string>("")

    const { 
        categories,
        pageCount,
        questionCount,
        uncorrectedQuestionCount,
        correctedQuestionCount,
        temporaryQuestionCount,
    } = useCategories(
        page,
        limit,
        searchCategoryWord,
        searchSubcategoryWord,
        searchQuestionWord,
        searchAnswerWord
    )

    return (
       <div className="min-h-screen">
            <Link 
                to="/createcategory" 
                className={`
                    inline-flex items-center 
                    justify-center w-22 h-22 
                    text-white bg-yellow-green-500 
                    rounded-full cursor-pointer 
                    no-underline break-words
                `}
            >
                Create Category
            </Link>
            
            <div className="flex mt-4">
                <div>
                    <h3>The total number of Questions：{questionCount}</h3>
                    <h3>The total number of uncorrected Questions：{uncorrectedQuestionCount}</h3>
                    <h3>The total number of temporary Questions：{temporaryQuestionCount}</h3>
                    <h3>The total number of corrected Questions：{correctedQuestionCount}</h3>
                </div>

                <Link to="/categorylist">カテゴリの一覧のページに移動</Link>
            </div>
            
            <h1>ctr i でsetproblempageにとべる</h1>
            
            <div className="flex mt-4">
                <Search 
                    type="category"
                    searchCategoryWord={searchCategoryWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
                    autoFocus={true}
                />
                <Search 
                    type="subcategory"
                    searchSubcategoryWord={searchSubcategoryWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
                />
                <Link 
                    to="/question_list" 
                    className="w-full px-2 py-2 bg-transparent border border-green-700 text-green-700 rounded-md cursor-pointer transition-all duration-150 hover:bg-green-700 hover:text-white"
                >
                    Question一覧検索ページ
                </Link>
                <Search 
                    type="question"
                    searchQuestionWord={searchQuestionWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
                />
                <Search 
                    type="answer"
                    searchAnswerWord={searchAnswerWord}
                    setSearchCategoryWord={setSearchCategoryWord}
                    setSearchSubcategoryWord={setSearchSubcategoryWord}
                    setSearchQuestionWord={setSearchQuestionWord}
                    setSearchAnswerWord={setSearchAnswerWord}
                    page={page} 
                    setPage={setPage} 
                /> 
            </div>
            
            <Pagination
                currentPage={page}
                totalPages={pageCount}
                onPageChange={(newPage) => setPage(newPage)}
            />
            
            <CategoryList 
                categories={categories} 
                searchSubcategoryWord={searchSubcategoryWord} 
                searchQuestionWord={searchQuestionWord} 
                searchAnswerWord={searchAnswerWord}
            />
        </div>
    );
};
