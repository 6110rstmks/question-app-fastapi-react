import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { SubcategoryWithCategoryName } from '../../../types/Subcategory'
import { Question } from '../../../types/Question'
import { fetchSubcategoriesWithCategoryNameByQuestionId } from '../../../api/SubcategoryAPI'
import { deleteQuestion, incrementAnswerCount, fetchQuestion, updateQuestionIsCorrect } from '../../../api/QuestionAPI'
import { handleKeyDown } from '../../../utils/function'

export const useQuestionPage = (
    categoryId: number,
    subcategoryId: number,
    questionId: number,
    categoryName: string
) => {
    const [question, setQuestion] = useState<Question>();
    const [subcategoriesWithCategoryName, setSubcategoriesWithCategoryName] = useState<SubcategoryWithCategoryName[]>([]);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

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

    const handleUpdateIsCorrect = async () => {
        await updateQuestionIsCorrect(question!); // API コール
        const data = await fetchQuestion(question!.id); // データをリフレッシュ
        setQuestion(data)
    }

    // このQuestionPageに遷移した元のSubcategoryPageに戻る。
    // const handleNavigateToPreviousSubcategoryPage = () => {
    //     const category = { id: categoryId, name: categoryName };
    //     navigate(`/subcategory/${subcategoryId}`, {
    //         state: category
    //     });
    // }

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
            const data2: SubcategoryWithCategoryName[] = await fetchSubcategoriesWithCategoryNameByQuestionId(questionId);
            setSubcategoriesWithCategoryName(data2);
        })();


    }, [questionId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return { 
        subcategoriesWithCategoryName,
        setSubcategoriesWithCategoryName,
        question,
        setQuestion,
        showAnswer,
        setShowAnswer,
        handleDeleteQuestion,
        handleAnswerQuestion,
        handleUpdateIsCorrect,
        // handleNavigateToPreviousSubcategoryPage
    };
}



