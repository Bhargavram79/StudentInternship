const StatusBadge = ({ status }) => {
    const getClass = () => {
        switch (status?.toUpperCase()) {
            case 'PENDING': return 'badge-pending';
            case 'ACCEPTED': case 'DONE': return 'badge-success';
            case 'REJECTED': return 'badge-danger';
            case 'IN_PROGRESS': return 'badge-warning';
            case 'TODO': return 'badge-info';
            default: return 'badge-default';
        }
    };

    return (
        <span className={`status-badge ${getClass()}`}>
            <span className="status-dot"></span>
            {status}
        </span>
    );
};

export default StatusBadge;
