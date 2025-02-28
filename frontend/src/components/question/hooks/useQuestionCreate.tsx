import { useCallback, useEffect, useState } from 'react'
import { fetchQuestionsBySubcategoryId } from '../../../api/QuestionAPI'
import { Question } from '../../../types/Question'

export const useQuestionCreate = (
    categoryId: number,
    subcategoryId: number,
    setQuestions: (questions: Question[]) => void,
    setModalIsOpen: (isOpen: boolean) => void,
) => {

    const [answers, setAnswers] = useState<string[]>(['']);
    const [problem, setProblem] = useState<string>('');
    const [memo, setMemo] = useState<string>('');


    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const addAnswerField = () => {
        setAnswers([...answers, '']);
    };

    const removeAnswerInput = (indexToRemove: number) => {
        setAnswers(answers.filter((_, index) => index !== indexToRemove));
    }

    const createQuestion = async () => {

        // 問題文が空の場合はエラーを表示
        if (!problem) {
            alert('問題文を入力してください');
            return;
        } 

        const response = await fetch('http://localhost:8000/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // ここは例外でjavascriptのコードだが、pythonコード側にデータを送るため命名方式はキャメルケースを使用する。
            body: JSON.stringify({ 
                                    problem: problem,
                                    answer: answers,
                                    memo: memo,
                                    category_id: categoryId,
                                    subcategory_id: subcategoryId 
                                }),
        });

        if (!response.ok) {
            throw new Error('Failed to create question');
        }
        const data = await fetchQuestionsBySubcategoryId(subcategoryId)
        setQuestions(data);
        setModalIsOpen(false);
    };

    // タッチパッド誤操作のブラウザバックを防ぐ
    const blockBrowserBack = useCallback(() => {
        window.history.go(1)
    }, [])
    
    useEffect(() => {
        // 直前の履歴に現在のページを追加
        window.history.pushState(null, '', window.location.href)
    
        // 直前の履歴と現在のページのループ
        window.addEventListener('popstate', blockBrowserBack)
    
        // クリーンアップは忘れない
        return () => {
            window.removeEventListener('popstate', blockBrowserBack)
        }
    }, [blockBrowserBack])
    
    return {
        problem,
        setProblem,
        answers,
        memo,
        setMemo,
        removeAnswerInput,
        createQuestion,
        handleAnswerChange,
        addAnswerField
    }
}