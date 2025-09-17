import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProblem, fetchProblemByDay } from '../../../api/ProblemAPI'
import type { SolutionStatus } from '../../../types/SolutionStatus'
import type { Question } from '../../../types/Question'
import { SolutionStatusReverse } from '../../../types/SolutionStatus'

const useSetProblemPage = () => {
    const [
        solutionStatusNumber,
        setSolutionStatusNumber
    ] = useState<SolutionStatus>(0)

    const navigate = useNavigate()

    function toLowerFirst(str: string): string {
        if (!str) return ''
        return str.charAt(0).toLowerCase() + str.slice(1)
    }

    // サイト内ショートカットキーの設定
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (
            event.metaKey && // macOSでcommandキーまたはCapsLockキーを表す
            event.key === "Enter"
        ) {            
            event.preventDefault()
            handleSetProblem()
        }
    // なぜSolutionStatusNumberを依存配列にいれるかについては、Stale Closureの問題を避けるため
    // 理解してないのでまた調べて
    }, [solutionStatusNumber])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])



    // ボタンをクリックしたら、問題群を生成して、問題出題画面に遷移する。その際レスポンスのデータを渡す。
    const handleSetProblem = async () => {

        const problemData: Question[] = await fetchProblem(
            'random',
            toLowerFirst(SolutionStatusReverse[solutionStatusNumber]) as "correct" | "incorrect" | "temporary",
            4, 
            [],
            []
        )
        navigate('/problem', { 
            state: {
                problemData, 
                from: 'setProblemPage' 
            }
        })
    }


    const handleTodayReview = async () => {
        const today = new Date()
        let problemData = await fetchProblemByDay(today)


        // problemDataが空であれば、明日の問題を取得する
        if (!problemData ||problemData.length === 0) {
            const confirmNextDay = window.confirm('today\'s problems are all answered. Do you want to fetch tomorrow\'s problems?')
            if (!confirmNextDay) {
                return
            }
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            problemData = await fetchProblemByDay(tomorrow)
        }

        if (!problemData || Object.keys(problemData).length === 0) {
            alert('No problems available for today or tomorrow.')
            return
        }

        navigate('/problem', { 
            state: {
                problemData, 
                from: 'setProblemPage',
            }
        })
    }

    return {
        handleSetProblem,
        handleTodayReview,
        solutionStatusNumber,
        setSolutionStatusNumber
    }
}
export default useSetProblemPage