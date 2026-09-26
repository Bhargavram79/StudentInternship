import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
    if (!open) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <button className="confirm-close" onClick={onCancel} aria-label="Close">
                    <FiX />
                </button>
                <div className={`confirm-icon-wrap ${variant}`}>
                    <FiAlertTriangle />
                </div>
                <h3 className="confirm-title">{title || 'Are you sure?'}</h3>
                <p className="confirm-message">{message || 'This action cannot be undone.'}</p>
                <div className="confirm-actions">
                    <button className="confirm-btn cancel" onClick={onCancel}>{cancelText}</button>
                    <button className={`confirm-btn ${variant}`} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
