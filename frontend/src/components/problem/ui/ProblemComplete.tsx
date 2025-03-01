import React from "react";
import { Link } from "react-router-dom";

interface Props {
    unsolvedCount: number;
    onReview: () => void;
}

export const ProblemComplete: React.FC<Props> = ({ unsolvedCount, onReview }) => {
    return (
        <div>
            <h1>Complete!</h1>
            {unsolvedCount > 0 ? (
                <button onClick={onReview}>解けなかった問題を再度復習する</button>
            ) : (
                <p>全問正解！</p>
            )}
            <Link to="/categories/home">Back to Home</Link>

        </div>
    );
};

