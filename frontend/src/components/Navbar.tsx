import React from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavbar } from "./useNavbar"

const Navbar: React.FC = () => {
    const { handleJsonExport, handleCSVExport } = useNavbar()

    return (
        <nav className="flex justify-around items-end h-12 bg-teal-800 gap-11">
            <Link 
                to="/categories/home" 
                className="inline-block relative px-5 py-0.5 text-white rounded cursor-pointer text-center transition-all duration-300 hover:bg-green-200 hover:text-gray-800 hover:text-teal-500"
            >
                <FontAwesomeIcon icon={faHouse} />
                HOME
            </Link>
            
            <Link 
                to="/logout" 
                className="inline-block relative px-5 py-0.5 text-white rounded cursor-pointer text-center transition-all duration-300 hover:bg-green-200 hover:text-gray-800 hover:text-teal-500"
            >
                <FontAwesomeIcon icon={faArrowRightToBracket} />
                SignOut
            </Link>
            
            <Link 
                to="/set_question" 
                className="inline-block relative px-5 py-0.5 text-white rounded cursor-pointer text-center transition-all duration-300 hover:bg-green-200 hover:text-gray-800 hover:text-teal-500"
            >
                Set Problem
            </Link>
            
            <Link 
                to="/import" 
                className="group inline-block relative px-5 py-0.5 text-white rounded cursor-pointer text-center transition-all duration-300 hover:bg-green-200 hover:text-gray-800 hover:text-teal-500"
            >
                Data Import
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white px-3 py-2 rounded whitespace-nowrap opacity-0 invisible transition-all duration-300 z-20 group-hover:opacity-100 group-hover:visible hover:bg-gray-600">
                    システム特有のjsonファイルをインポートすることでデータの引き継ぎができます。
                </div>
            </Link>
            
            <div className="group inline-block relative px-5 py-0.5 text-white rounded cursor-pointer text-center transition-all duration-300 hover:bg-green-200 hover:text-gray-800">
                Data Export to Local & Github
                <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white px-3 py-2 rounded whitespace-nowrap opacity-0 invisible transition-all duration-300 z-20 group-hover:opacity-100 group-hover:visible hover:bg-gray-600 cursor-pointer" 
                    onClick={handleJsonExport}
                >
                    JSONでexport
                </div>
                <div 
                    className="absolute left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded whitespace-nowrap opacity-0 invisible transition-all duration-300 z-10 group-hover:opacity-100 group-hover:visible hover:bg-gray-600 cursor-pointer"
                    style={{ top: 'calc(100% + 60px)' }}
                    onClick={handleCSVExport}
                >
                    CSVでexport
                </div>
            </div>
            
            <Link 
                to="/report_page"
                className="inline-block relative px-5 py-0.5 text-white rounded cursor-pointer text-center transition-all duration-300 hover:bg-green-200 hover:text-gray-800 hover:text-teal-500"
            >
                回答レポートを表示
            </Link>
        </nav>
    )
}

export default Navbar
