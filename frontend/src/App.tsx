import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/login/Login'
import Logout from './components/login/Logout'
import Navbar from './components/Navbar'
import QuestionPage from './components/QuestionPage'
import CreateCategory from './components/CreateCategory'
import CreateQuestion from './components/CreateQuestion'
import SubcategoryPage from './components/SubcategoryPage'
import SetQuestion from './components/SetProblem'
import ProblemPage from './components/ProblemPage'
import ImportPage from './components/ImportPage'

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(!!localStorage.getItem("isAuth"));

  return (
    <Router>
      <Navbar isAuth={isAuth} />
      <Routes>
        {/* 最初の画面 */}
        <Route path="/" element={<Home />} />

        {/* カテゴリ作成画面 */}
        <Route path="/createcategory" element={<CreateCategory isAuth={isAuth} />} />

        {/* 問題出題画面 */}
        <Route path="/setquestion" element={<SetQuestion />} />
        {/* <Route path="/setquestion" element={<SetQuestion isAuth={isAuth} />} /> */}
        {/* <Route path="/createquestion" element={<CreateQuestion category_id={}/>} /> */}
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/logout" element={<Logout setIsAuth={setIsAuth} />} />
        <Route path="/subcategory/:subcategory_id" element={<SubcategoryPage />} />
        <Route path="/question/:question_id" element={<QuestionPage />} />
        <Route path="/problem" element={<ProblemPage />} />
        <Route path="/import" element={<ImportPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
