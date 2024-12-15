import React from "react";

interface Props {
    unsolvedCount: number;
    onReview: () => void;
}

const ProblemComplete: React.FC<Props> = ({ unsolvedCount, onReview }) => {
    return (
        <div>
            <h1>Complete!</h1>
            {unsolvedCount > 0 ? (
                <button onClick={onReview}>解けなかった問題を再度復習する</button>
            ) : (
                <p>全問正解！</p>
            )}
        </div>
    );
};

export default ProblemComplete;
