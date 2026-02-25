import { useState, useEffect, useRef } from 'react';

const StatsCard = ({ icon, title, value, color, trend }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const cardRef = useRef(null);

    useEffect(() => {
        const target = Number(value) || 0;
        if (target === 0) { setDisplayValue(0); return; }
        let start = 0;
        const duration = 800;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value]);

    const gradients = {
        '#6366f1': 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
        '#7c3aed': 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
        '#f59e0b': 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)',
        '#10b981': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        '#ef4444': 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
        '#3b82f6': 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
    };

    const bgColor = `${color}15`;
    const gradient = gradients[color] || `linear-gradient(135deg, ${color} 0%, ${color}88 100%)`;

    return (
        <div className="stats-card" ref={cardRef}>
            <div className="stats-icon" style={{ background: bgColor, color: color }}>
                {icon}
            </div>
            <div className="stats-info">
                <span className="stats-value">{displayValue}</span>
                <span className="stats-title">{title}</span>
                {trend && (
                    <span className={`stats-trend ${trend > 0 ? 'up' : 'down'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
