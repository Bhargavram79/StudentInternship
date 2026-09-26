import { useState, useEffect } from 'react';
import { getInternships, applyToInternship, getMyApplications } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { FiSend, FiClock, FiMapPin, FiSearch, FiFilter, FiX, FiDollarSign, FiMonitor, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-toastify';

const BrowseInternships = () => {
    const [internships, setInternships] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [appliedIds, setAppliedIds] = useState(new Set());
    const [search, setSearch] = useState('');
    const [modeFilter, setModeFilter] = useState('All');
    const [durationFilter, setDurationFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        let result = [...internships];
        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(i =>
                i.title.toLowerCase().includes(q) ||
                i.company.toLowerCase().includes(q) ||
                i.skills?.toLowerCase().includes(q)
            );
        }
        // Filters
        if (modeFilter !== 'All') result = result.filter(i => i.mode === modeFilter);
        if (durationFilter !== 'All') result = result.filter(i => i.duration === durationFilter);
        if (typeFilter !== 'All') result = result.filter(i => i.type === typeFilter);
        // Sort
        if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        else if (sortBy === 'company') result.sort((a, b) => a.company.localeCompare(b.company));
        else if (sortBy === 'duration') result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        setFiltered(result);
    }, [internships, search, modeFilter, durationFilter, typeFilter, sortBy]);

    const fetchData = async () => {
        try {
            const [intRes, appRes] = await Promise.all([getInternships(), getMyApplications()]);
            setInternships(intRes.data);
            setFiltered(intRes.data);
            const ids = new Set(appRes.data.map(a => a.internship?.id));
            setAppliedIds(ids);
        } catch (err) { console.error(err); }
    };

    const handleApply = async (id) => {
        try {
            await applyToInternship(id);
            toast.success('Applied successfully!');
            fetchData();
        } catch (err) { toast.error('Failed to apply'); }
    };

    const clearFilters = () => {
        setSearch('');
        setModeFilter('All');
        setDurationFilter('All');
        setTypeFilter('All');
        setSortBy('newest');
    };

    const hasFilters = search || modeFilter !== 'All' || durationFilter !== 'All' || typeFilter !== 'All';
    const durations = ['All', '1 month', '2 months', '3 months'];

    const getModeIcon = (mode) => {
        if (mode === 'Online') return <FiGlobe />;
        if (mode === 'Offline') return <FiMapPin />;
        return <FiMonitor />;
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Browse Internships</h1>
                <p>{filtered.length} internship{filtered.length !== 1 ? 's' : ''} available</p>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-search">
                    <FiSearch className="filter-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by title, company, or skills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-chips">
                    <select className="filter-select" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
                        <option value="All">All Modes</option>
                        <option value="Online">🌐 Online</option>
                        <option value="Offline">📍 Offline</option>
                        <option value="Hybrid">💻 Hybrid</option>
                    </select>
                    <select className="filter-select" value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
                        {durations.map(d => <option key={d} value={d}>{d === 'All' ? 'All Durations' : d}</option>)}
                    </select>
                    <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="All">All Types</option>
                        <option value="Free">🆓 Free</option>
                        <option value="Paid">💰 Paid</option>
                    </select>
                    <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="company">By Company</option>
                        <option value="duration">By Duration</option>
                    </select>
                    {hasFilters && (
                        <button className="filter-clear" onClick={clearFilters}>
                            <FiX /> Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="internship-grid">
                {filtered.map((i) => (
                    <div key={i.id} className="internship-card">
                        <div className="internship-card-header">
                            <h3>{i.title}</h3>
                            <span className="company-name">{i.company}</span>
                        </div>
                        <p className="internship-desc">{i.description}</p>
                        <div className="internship-badges">
                            <span className={`intern-badge mode-${i.mode?.toLowerCase()}`}>
                                {getModeIcon(i.mode)} {i.mode}
                            </span>
                            <span className="intern-badge duration">
                                <FiClock /> {i.duration}
                            </span>
                            <span className={`intern-badge type-${i.type?.toLowerCase()}`}>
                                {i.type === 'Paid' ? <FiDollarSign /> : '🆓'} {i.type}
                            </span>
                            {i.stipend && (
                                <span className="intern-badge stipend">{i.stipend}</span>
                            )}
                        </div>
                        <div className="internship-meta">
                            {i.skills && <span><FiFilter /> {i.skills}</span>}
                        </div>
                        <div className="internship-card-footer">
                            {appliedIds.has(i.id) ? (
                                <StatusBadge status="PENDING" />
                            ) : (
                                <button className="btn btn-primary" onClick={() => handleApply(i.id)}>
                                    <FiSend /> Apply Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="empty-state-card">
                        No internships match your filters.
                        <button className="filter-clear" onClick={clearFilters} style={{ marginTop: '0.5rem' }}>
                            <FiX /> Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseInternships;
