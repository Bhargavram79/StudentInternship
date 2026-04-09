const SkeletonLoader = ({ count = 3, type = "card" }) => {
    return (
        <div className="skeleton-container" style={{ display: 'grid', gap: '20px', width: '100%' }}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px', borderRadius: '14px' }}>
                    {type === "card" && (
                        <>
                            <div className="skeleton skeleton-title"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                        </>
                    )}
                    {type === "list" && (
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div className="skeleton skeleton-avatar"></div>
                            <div style={{ flex: 1 }}>
                                <div className="skeleton skeleton-title" style={{ margin: 0, marginBottom: '8px' }}></div>
                                <div className="skeleton skeleton-text" style={{ margin: 0 }}></div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
