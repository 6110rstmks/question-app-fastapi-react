import React from 'react'
import { Question } from '../types/Question'

interface ChangeCategorySubcategoryProps {
  setModalIsOpen: (isOpen: boolean) => void;
  question?: Question;
  setQuestion: (question: Question) => void;
}

const ChangeCategorySubcategory: React.FC<ChangeCategorySubcategoryProps> = ({setModalIsOpen, question, setQuestion}) => {
  return (
    // クエスチョンに紐づくカテゴリ、サブカテゴリを階層形式と表示してそこから選択ボックスで選択
    <div>ChangeCategorySubcategory</div>
  )
}

export default ChangeCategorySubcategory