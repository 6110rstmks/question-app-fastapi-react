import React from "react"

interface PaginationProps {
    currentPage: number
    totalPages: number | null
    onPageChange: (newPage: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange 
}) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        } else if (currentPage === 1) {
            onPageChange(totalPages || 1)
        }
        window.scrollTo(0, 0)
    }

    const handleNext = () => {
        if (totalPages === null || currentPage < totalPages) {
            onPageChange(currentPage + 1)
        } else if (currentPage === totalPages) {
            onPageChange(1)
        }
        window.scrollTo(0, 0)
    }

    return (
        <div className="block w-48 ml-24">
            <div className="flex items-center gap-3 text-sm">
                <button 
                    className="px-4 py-2 rounded-2xl bg-black/20 text-white/90 border border-white/10 cursor-pointer transition-colors duration-200 backdrop-blur-sm hover:bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePrevious}>
                    Previous
                </button>
                <span className="text-white/80">
                {currentPage}
                <span className="mx-1">/</span>
                {totalPages}
                </span>
                <button 
                    className="px-4 py-2 rounded-2xl bg-black/20 text-white/90 border border-white/10 cursor-pointer transition-colors duration-200 backdrop-blur-sm hover:bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleNext}>
                    Next
                </button>
            </div>
        </div>        
    )
}

export default Pagination;
