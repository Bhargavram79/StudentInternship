const PageLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="page-loader">
            <div className="page-loader-spinner">
                <div className="loader-ring"></div>
                <div className="loader-ring"></div>
                <div className="loader-ring"></div>
            </div>
            <p className="page-loader-text">{message}</p>
        </div>
    );
};

export default PageLoader;
