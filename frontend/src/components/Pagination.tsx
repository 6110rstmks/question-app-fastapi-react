// Pagination.tsx
import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number | null;
    onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
        console.log(currentPage)
        console.log(totalPages)
    };

    const handleNext = () => {
        if (totalPages === null || currentPage < totalPages) onPageChange(currentPage + 1);
        console.log(currentPage)
    };

    return (
        <div className={styles.pagination}>
            <button className={styles.pagination_btn} onClick={handlePrevious}>
                Previous
            </button>
            <button className={`${styles.pagination_btn} ${styles.left_btn}`} onClick={handleNext}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
