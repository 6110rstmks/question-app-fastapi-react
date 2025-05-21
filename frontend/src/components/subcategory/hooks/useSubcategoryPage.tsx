import { useEffect, useState, useRef } from 'react'
import { fetchSubcategory } from '../../../api/SubcategoryAPI'
import { useLocation, useNavigate } from 'react-router';
import { fetchQuestionsBySubcategoryId, fetchUncorrectedQuestionCountBySubcategoryId } from '../../../api/QuestionAPI'
import { Question } from '../../../types/Question'
import { updateSubcategoryName } from '../../../api/SubcategoryAPI';
import { handleKeyDown } from '../../../utils/function';
import { fetchProblem } from '../../../api/ProblemAPI';
import { handleNavigateToCategoryPage } from '../../../utils/navigate_function';
interface locationState {
    categoryId: number;
    categoryName: string;
    subcategoryId: number;
    subcategoryName: string;
}

interface categoryInfo {
    id: number;
    name: string;
    userId: number;
}

export const useSubcategoryPage = (
    subcategoryId: number,
) => {
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [uncorrectedQuestionCnt, setUncorrectedQuestionCnt] = useState<number | null>(null);
    const location = useLocation()
    const navigate = useNavigate();

    // 初回レンダリングかどうかの状態を管理
    // useEffectの初回実行を防ぐ。
    const isFirstRender = useRef(true);

    // サブカテゴリ名の編集モードの状態を管理
    const [isEditing, setIsEditing] = useState<boolean>(false);
    // 回答の表示非表示ボタンの状態を管理
    const [showAnswer, setShowAnswer] = useState(false); 

    // リロードした際はここから取得する

    const [categoryInfo, setCategoryInfo] = useState<categoryInfo>(() => {
        const saved = localStorage.getItem('categoryInfo');
        return saved ? JSON.parse(saved) : { id: 0, name: '', userId: 0 };
    })

    // エンターキーで編集モードを終了し、サブカテゴリ名を更新
    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            await updateSubcategoryName(subcategoryId, subcategoryName);
        }
    };

    const handleSetTemporaryProblem = async () => {
        const response = await fetchProblem('subcategory', 'temporary', 4, [], [subcategoryId]);
        if (!response.ok) {
            alert('出題する問題がありません。');
            return
        }
        const problemData = await response.json();
        navigate('/problem', { 
            state: {
                problemData, 
                from: 'subcategoryPage',
                backToId: subcategoryId
            }
        });
    }

    const handleSetUnsolvedProblem = async () => {
        const response = await fetchProblem('subcategory', 'incorrect', 4, [], [subcategoryId]);
        if (!response.ok) {
            alert('出題する問題がありません。');
            return 
        }

        const problemData = await response.json();
        navigate('/problem', { 
            state: {
                problemData, 
                from: 'subcategoryPage',
                backToId: subcategoryId
            }
        });
    }

    //「削除」と入力してクリックすることで削除が実行される。
    const handleDeleteSubcategory = async () => {

        let confirmation = prompt("削除を実行するには、「削除」と入力してください:")

        if (confirmation !== '削除') {
            return
        }

        let confirmation2 = prompt("本当に削除しますか？削除する場合は「本当に削除」と入力してください:")

        if (confirmation2 !== '本当に削除') {
            return
        }

        const response = await fetch(`http://localhost:8000/subcategories/${subcategoryId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            prompt('Failed to delete subcategory')
        }

        handleNavigateToCategoryPage(
            navigate,
            categoryInfo
        )

    }
    
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => handleKeyDown(event, setShowAnswer);

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [handleKeyDown]);

    // これはリロードした際に必要。
    useEffect(() => {
        if (location.state) {
            setCategoryInfo(location.state);
            localStorage.setItem('categoryInfo', JSON.stringify(location.state));
        }
    }, [location.state]);
    
    useEffect(() => {
        // CategoryBoxからSubcategoryPageに移動する際に、CategoryBoxがページの下の方の場合、
        // SubcategoryPageに移動した際にページの一番上にスクロールする。
        window.scrollTo(0, 0);

        (async () => {
            const questions_data = await fetchQuestionsBySubcategoryId(subcategoryId);
            setQuestions(questions_data);

            const subcategory_data = await fetchSubcategory(subcategoryId);
            setSubcategoryName(subcategory_data.name)

            const uncorrectedQuestionCnt = await fetchUncorrectedQuestionCountBySubcategoryId(subcategoryId);
            setUncorrectedQuestionCnt(uncorrectedQuestionCnt);
        })();

        // これなくてもいい気がする。
        // 単体テスト項目書を作成して手動で一通りテストする。
        // もし万が一エラーが発生した際は、ここのコメントアウトを外して再度操作してエラーが起きないか確認する。
        // if (category) {
        //     localStorage.setItem('categoryInfo', JSON.stringify(category));
        // }

    }, [subcategoryId])

    return {
        subcategoryName,
        setSubcategoryName,
        questions,
        setQuestions,
        categoryInfo,
        handleDeleteSubcategory,
        showAnswer,
        setShowAnswer,
        isEditing,
        setIsEditing,
        uncorrectedQuestionCnt,
        handleKeyPress,
        handleSetUnsolvedProblem,
        handleSetTemporaryProblem
    };
}

