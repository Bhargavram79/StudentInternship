import { useState, useEffect } from 'react';
import { getMyFeedback } from '../../services/api';
import { FiStar } from 'react-icons/fi';

const MyFeedback = () => {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const { data } = await getMyFeedback();
                setFeedback(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFeedback();
    }, []);

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Feedback</h1>
                <p>Evaluations and ratings from your mentors</p>
            </div>

            <div className="feedback-list">
                {feedback.map((f) => (
                    <div key={f.id} className="feedback-card">
                        <div className="feedback-header">
                            <div>
                                <h3>From: {f.mentor?.name}</h3>
                                {f.task && <span className="feedback-task">Task: {f.task?.title}</span>}
                            </div>
                            <div className="feedback-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar key={star} className={`star ${star <= f.rating ? 'filled' : ''}`} />
                                ))}
                            </div>
                        </div>
                        <p className="feedback-comment">{f.comment}</p>
                        <span className="feedback-date">{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                ))}
                {feedback.length === 0 && (
                    <div className="empty-state-card">No feedback received yet. Keep up the good work!</div>
                )}
            </div>
        </div>
    );
};

export default MyFeedback;
