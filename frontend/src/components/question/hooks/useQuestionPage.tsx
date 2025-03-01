import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Question } from '../../../types/Question'
import { fetchQuestion } from '../../../api/QuestionAPI'
import { fetchSubcategoriesByQuestionId } from '../../../api/SubcategoryAPI'
import { Subcategory } from '../../../types/Subcategory'
import { deleteQuestion, incrementAnswerCount } from '../../../api/QuestionAPI'
import { handleKeyDown } from '../../../utils/function'

export const useQuestionPage = (
    questionId: number,
    initialCategoryInfo?: { [key: string]: any }
) => {
    const [question, setQuestion] = useState<Question>();
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    // const [categoryInfo, setCategoryInfo] = useState(() => {
    //     const saved = localStorage.getItem('categoryInfo');
    //     return saved ? JSON.parse(saved) : initialCategoryInfo || {};
    // });

    const navigate = useNavigate()
    

    const handleDeleteQuestion = async () => {
        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");
        if (confirmation !== '削除') {
            return;
        }
        await deleteQuestion(questionId); // API コール
        navigate('/');
    }

    const handleAnswerQuestion = () => {
        incrementAnswerCount(question!.id); // API コール
        // 表示するquestion.answer_countの数も更新
        setQuestion((prev) => {
            if (prev) {
                return {
                    ...prev,
                    answer_count: prev.answer_count + 1,
                };
            }
            return prev;
        });

        alert('回答数を更新しました');
    }

    // const handleKeyDown = useCallback((event: KeyboardEvent) => {
    //     if (event.ctrlKey && event.key.toLowerCase() === 'b') {
    //         event.preventDefault();
    //         setShowAnswer(prev => !prev);
    //     }
    // }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => handleKeyDown(event, setShowAnswer);

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        // 質問データを取得して設定
        (async () => {
            const data: Question = await fetchQuestion(questionId);
            setQuestion(data);

            // 所属するサブカテゴリを変更する際に使用する。
            const data2: Subcategory[] = await fetchSubcategoriesByQuestionId(questionId);
            setSubcategories(data2);
        })();

        // ↓これいらないかも

        // カテゴリ情報をローカルストレージに保存
        // ローカルストレージに保存する理由は、リロード時にカテゴリ情報が消えないようにするため
        // リロードした場合、QuestionPageからカテゴリ情報を取得できないため、カテゴリ情報はローカルストレージから取得する
        // if (initialCategoryInfo) {
        //     setCategoryInfo(initialCategoryInfo);
        //     localStorage.setItem('categoryInfo', JSON.stringify(initialCategoryInfo));
        // }
    // }, [questionId, initialCategoryInfo]);
    }, [questionId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return { 
        subcategories,
        setSubcategories,
        question,
        setQuestion,
        showAnswer,
        setShowAnswer,
        handleDeleteQuestion,
        handleAnswerQuestion 
    };
}



