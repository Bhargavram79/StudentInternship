import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ icon, message, action, onAction }) => {
    return (
        <div className="empty-state-card">
            <div className="empty-icon">{icon || <FiInbox />}</div>
            <p>{message || 'Nothing here yet'}</p>
            {action && onAction && (
                <button className="btn btn-primary btn-sm" onClick={onAction} style={{ marginTop: '0.5rem' }}>
                    {action}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
