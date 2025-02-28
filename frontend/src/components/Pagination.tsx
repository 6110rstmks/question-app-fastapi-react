// Pagination.tsx
import React from "react";
import styles from "./Pagination.module.css";

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
        if (currentPage > 1) onPageChange(currentPage - 1);
        window.scrollTo(0, 0)
    };

    const handleNext = () => {
        if (totalPages === null || currentPage < totalPages) onPageChange(currentPage + 1);
        window.scrollTo(0, 0)
    };

    return (
        <div className={styles.paginationContainer}>
            <button className={styles.paginationBtn} onClick={handlePrevious}>
                Previous
            </button>
            <span className={styles.pageInfo}>{currentPage} / { totalPages }</span>
            <button className={`${styles.paginationBtn} ${styles.left_btn}`} onClick={handleNext}>
                Next
            </button>
        </div>
        
    );
};

export default Pagination;
