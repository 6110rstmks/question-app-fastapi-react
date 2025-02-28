import { useEffect, useState, useCallback, useRef } from 'react'
import { fetchSubcategory } from '../../../api/SubcategoryAPI'
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchQuestionsBySubcategoryId } from '../../../api/QuestionAPI'
import { Question } from '../../../types/Question'
import { Category } from '../../../types/Category'
import { updateSubcategoryName } from '../../../api/SubcategoryAPI';

export const useSubcategoryPage = (
    subcategoryId: number,
    category: Category,
) => {
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const location = useLocation()
    const navigate = useNavigate();

    // 初回レンダリングかどうかの状態を管理
    // useEffectの初回実行を防ぐ。
    const isFirstRender = useRef(true);


    // サブカテゴリ名の編集モードの状態を管理
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState(false); 

    const [categoryInfo, setCategoryInfo] = useState(() => {
        const saved = localStorage.getItem('categoryInfo');
        return saved ? JSON.parse(saved) : {};
    })

    // エンターキーで編集モードを終了し、サブカテゴリ名を更新
    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            await updateSubcategoryName(subcategoryId, subcategoryName);
        }
    };
        
    // const handleNavigateToQuestionPage = (question_id: number) => {
    //     navigate(`/question/${question_id}`, { 
    //         state: {
    //             category_id: categoryInfo.id,
    //             subcategory_id: subcategoryId,
    //             categoryName: categoryInfo.name,
    //             subcategoryName: subcategoryName,
    //         } 
    //     });
    // }

    //「削除」と入力してクリックすることで削除が実行される。
    const handleDeleteSubcategory = async () => {

        let confirmation = prompt("削除を実行するには、「削除」と入力してください:");

        if (confirmation !== '削除') {
            return;
        }

        const response = await fetch(`http://localhost:8000/subcategories/${subcategoryId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            prompt('Failed to delete subcategory');
        }
        navigate('/');
    }

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key.toLowerCase() === 'b') {
            event.preventDefault();
            setShowAnswer(prev => !prev);
        }
    }, []);
    
    useEffect(() => {
        // window.addEventListener('keydown', handleKeyDown);

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        console.log('こんにちは')
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        console.log('いいい')
        console.log(location.state)
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
        })();

        // これなくてもいい気がする。
        // 単体テスト項目書を作成して手動で一通りテストする。
        // もし万が一エラーが発生した際は、ここのコメントアウトを外して再度操作してエラーが起きないか確認する。
        // if (category) {
        //     localStorage.setItem('categoryInfo', JSON.stringify(category));
        // }

    }, [subcategoryId]);
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
        handleKeyPress
    };
}

