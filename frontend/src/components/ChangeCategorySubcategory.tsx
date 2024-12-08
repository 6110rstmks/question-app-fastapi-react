import React from 'react'

interface Question {
  id: number;
  problem: string;
  answer: string[];
  memo: string;
  is_correct: boolean;
  subcategory_id: number;
}

interface ChangeCategorySubcategoryProps {
  setModalIsOpen: (isOpen: boolean) => void;
  question?: Question;
  refreshQuestion: () => void;
}

const ChangeCategorySubcategory: React.FC<ChangeCategorySubcategoryProps> = ({setModalIsOpen, question, refreshQuestion}) => {
  return (
    // クエスチョンに紐づくカテゴリ、サブカテゴリを階層形式と表示してそこから選択ボックスで選択
    <div>ChangeCategorySubcategory</div>
  )
}

export default ChangeCategorySubcategory