import { get } from 'http';
import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom';
import "./QuestionPage.css"
export interface Question {
    id: number;
    problem: string;
    answer: string[];
    is_correct: boolean;
    subcategory_id: number;
}

const QuestionPage: React.FC = () => {
  const { question_id } = useParams<{ question_id: string }>();
  const [question, setQuestion] = useState<Question>();

  const getQuestion = async () => {
    const response = await fetch(`http://localhost:8000/questions/${question_id}`);
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      setQuestion(data);}
  }

  useEffect(() => {
    getQuestion();
  }, [])

  return (
    <>
      <div className='question-box'>
        <div className='question-problem'>問題：{question?.problem}</div>
        <div className='question-flg'>
            正解したかどうか：{question?.is_correct ? '正解' : '不正解'}
        </div>
        <div>
            <p className='question-answer'>答え</p>
            {question?.answer.map((answer, index) => (
              <div className='answer' key={index}>{answer}</div>
            ))}
        </div>
      </div>
    </>
  )
}

export default QuestionPage