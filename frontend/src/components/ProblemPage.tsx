import { useParams, Link, useLocation } from 'react-router-dom';

    interface Question {
        id: number;
        problem: string;
        answer: string[];
        subcategory_id: number;
    }

// type Question {
//     id: number;
//     problem: string;
//     answer: string[];
//     subcategory_id: number;
// }



const ProblemPage: React.FC = () => {
    const location = useLocation();
    const problemData = location.state as Question[];

    return (
        <div>
            <h1>Problem Page</h1>
            {problemData && problemData.length > 0 ? (
                problemData.map((question) => (
                    <div key={question.id}>
                        <h2>問題: {question.problem}</h2>
                        <p>回答:</p>
                        <ul>
                            {question.answer.map((ans, index) => (
                                <li key={index}>{ans}</li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No problems available.</p>
            )}
        </div>
    );
}

export default ProblemPage