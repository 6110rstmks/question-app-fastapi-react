import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './components/HomePage'
import Login from './components/login/Login'
import Signup from './components/login/Signup'
import Navbar from './components/Navbar'
import Logout from './components/login/Logout'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import QuestionPage from './components/question/QuestionPage'
import CategoryCreate from './components/category/CategoryCreate'
import SubcategoryPage from './components/subcategory/SubcategoryPage'
import ProblemPage from './components/problem/ProblemPage'
import ImportPage from './components/ImportPage'
import SetProblem from './components/problem/SetProblemPage'
import CategoryPage from './components/category/CategoryPage'
import ReportPage from './components/ReportPage'
import QuestionListPage from './components/question/QuestionListPage'
import NoMatchPage from './components/NoMatchPage'
import CategoryBlackListPage from './components/CategoryListPage'
import Today from './components/Today'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

const App: React.FC = () => {

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <KeyboardShortcuts /> 
          <Routes>
            {/* 最初の画面 */}

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/categories/home" element={<HomePage />} />

            {/* カテゴリ作成画面 */}
            <Route path="/createcategory" element={<CategoryCreate />} />

            {/* 問題出題画面 */}
            <Route path="/set_question" element={<SetProblem />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/categorylist" element={<CategoryBlackListPage />} />

            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/subcategory/:subcategoryId" element={<SubcategoryPage />} />
            <Route path="/question/:questionId" element={<QuestionPage />} />
            <Route path="/problem" element={<ProblemPage />} />
            <Route path="/import" element={<ImportPage />}/>
            <Route path="/report_page" element={<ReportPage />}/>
            <Route path="/question_list" element={<QuestionListPage />}/>
            <Route path="*" element={<NoMatchPage />} />
            <Route path="/today" element={<Today />}/>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>

  )
}

export default App
