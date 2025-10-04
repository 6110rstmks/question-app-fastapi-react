import React from "react"
import { Link } from "react-router"
import { CheckCircle, Trophy, RotateCcw, ArrowLeft, BookOpen, Target } from "lucide-react"


interface Props {
    unsolvedCount: number
    handleNavigateToProblemReviewPage: () => void
    from: 'subcategoryPage' | 'categoryPage' | 'setProblemPage'
    backToId?: number
}

export const ProblemCompletePage: React.FC<Props> = ({
    unsolvedCount,
    handleNavigateToProblemReviewPage,
    from,
    backToId
}) => {

    const isPerfectScore = unsolvedCount === 0

    const getBackgroundGradient = () => {
        return isPerfectScore 
            ? "from-emerald-400 via-teal-500 to-blue-500"
            : "from-blue-400 via-purple-500 to-pink-500"
    }

    const getCardBackground = () => {
        return isPerfectScore
            ? "from-emerald-50 to-teal-50"
            : "from-blue-50 to-purple-50"
    }

    const getBackLinkInfo = () => {
        switch(from) {
            case "categoryPage":
                return { 
                    url: `/category/${backToId}`, 
                    text: "Back to CategoryPage",
                    icon: <Target className="w-4 h-4" />
                }
            case "subcategoryPage":
                return { 
                    url: `/subcategory/${backToId}`, 
                    text: "Back to SubcategoryPage",
                    icon: <BookOpen className="w-4 h-4" />
                }
            case "setProblemPage":
                return { 
                    url: "/set_question", 
                    text: "Back to SetProblemPage",
                    icon: <Target className="w-4 h-4" />
                }
            default:
                return null
        }
    }

    const backLinkInfo = getBackLinkInfo()
    return (
       <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center p-4`}>
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white bg-opacity-20 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-auto">
                {/* Main Card */}
                <div className={`bg-gradient-to-br ${getCardBackground()} backdrop-blur-sm bg-opacity-90 rounded-3xl shadow-2xl border border-white border-opacity-20 overflow-hidden`}>
                    
                    {/* Header Section */}
                    <div className="text-center pt-12 pb-8 px-8">
                        <div className="mb-6">
                            {isPerfectScore ? (
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg mb-4 animate-pulse">
                                    <Trophy className="w-12 h-12 text-white" />
                                </div>
                            ) : (
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg mb-4">
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </div>
                            )}
                        </div>
                        
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            Complete!
                        </h1>
                        
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                    </div>

                    {/* Status Section */}
                    <div className="px-8 pb-8">
                        {isPerfectScore ? (
                            <div className="text-center">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 shadow-lg">
                                    <p className="text-2xl font-bold text-white mb-2">全問正解！</p>
                                    <div className="flex justify-center space-x-2">
                                        <span className="text-3xl animate-bounce" style={{ animationDelay: '0ms' }}>🎉</span>
                                        <span className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
                                        <span className="text-3xl animate-bounce" style={{ animationDelay: '400ms' }}>🏆</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 shadow-lg text-center">
                                    <p className="text-white font-semibold text-lg mb-1">
                                        {unsolvedCount}問の問題が未解決です
                                    </p>
                                    <span className="text-2xl">📝</span>
                                </div>
                                
                                <button 
                                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 mb-6"
                                    onClick={handleNavigateToProblemReviewPage}
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    <span>解けなかった問題を再度復習する</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Section */}
                    {backLinkInfo && (
                        <div className="px-8 pb-8">
                            <div className="border-t border-gray-200 border-opacity-50 pt-6">
                                <Link 
                                    to={backLinkInfo.url} 
                                    className="w-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 border-opacity-50"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    {backLinkInfo.icon}
                                    <span>{backLinkInfo.text}</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating particles effect */}
                {isPerfectScore && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-70 animate-ping"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${i * 0.5}s`,
                                    animationDuration: '2s'
                                }}
                            ></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
