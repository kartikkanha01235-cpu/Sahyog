import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI, skillAPI } from '../services/api';
import { Search, Filter, AlertCircle, Clock, CheckCircle, MapPin } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    status: '',
    category: '',
    urgency: '',
    location: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchRequests();
  }, [fetchRequests]);

  const fetchCategories = async () => {
    try {
      const response = await skillAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.query) params.query = filters.query;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.urgency) params.urgency = filters.urgency;
      if (filters.location) params.location = filters.location;

      const response = await requestAPI.getAll(params);
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      status: '',
      category: '',
      urgency: '',
      location: ''
    });
    setTimeout(() => fetchRequests(), 100);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Open': 'badge-success',
      'In Progress': 'badge-warning',
      'Completed': 'badge-gray',
      'Closed': 'badge-gray'
    };
    return badges[status] || 'badge-gray';
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      'High': 'badge-danger',
      'Medium': 'badge-warning',
      'Low': 'badge-gray'
    };
    return badges[urgency] || 'badge-gray';
  };

  const getUrgencyIcon = (urgency) => {
    if (urgency === 'High') return <AlertCircle size={14} />;
    if (urgency === 'Medium') return <Clock size={14} />;
    return <CheckCircle size={14} />;
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={styles.header}>
        <h1 style={styles.title}>Help Requests</h1>
        <p style={styles.subtitle}>
          Find opportunities to help others or get assistance
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={styles.searchBox}>
                <Search size={20} color="#94a3b8" />
                <input
                  type="text"
                  name="query"
                  placeholder="Search help requests..."
                  value={filters.query}
                  onChange={handleFilterChange}
                  style={styles.searchInput}
                />
              </div>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                name="status"
                className="select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="label">Category</label>
              <select
                name="category"
                className="select"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Urgency</label>
              <select
                name="urgency"
                className="select"
                value={filters.urgency}
                onChange={handleFilterChange}
              >
                <option value="">All Urgency Levels</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Filter size={18} />
                Apply Filters
              </button>
              <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
            No help requests found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
          {requests.map((request) => (
            <Link
              key={request._id}
              to={`/requests/${request._id}`}
              className="card"
              style={styles.requestCard}
            >
              <div style={styles.requestHeader}>
                <div style={styles.userInfo}>
                  <img
                    src={request.requesterId.profilePicture || `https://ui-avatars.com/api/?name=${request.requesterId.fullName}&size=48&background=3b82f6&color=fff`}
                    alt={request.requesterId.fullName}
                    style={styles.avatar}
                  />
                  <div>
                    <div style={styles.userName}>{request.requesterId.fullName}</div>
                    {request.requesterId.location && (
                      <div style={styles.userLocation}>
                        <MapPin size={12} />
                        {request.requesterId.location}
                      </div>
                    )}
                  </div>
                </div>
                <div style={styles.badges}>
                  <span className={`badge ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`badge ${getUrgencyBadge(request.urgencyLevel)}`}>
                    {getUrgencyIcon(request.urgencyLevel)}
                    {request.urgencyLevel}
                  </span>
                </div>
              </div>

              <h3 style={styles.requestTitle}>{request.title}</h3>
              <p style={styles.requestDescription}>{request.description}</p>

              <div style={styles.requestMeta}>
                <span className="badge badge-primary">{request.category}</span>
                <span style={styles.metaItem}>
                  <strong>Skill needed:</strong> {request.requiredSkill}
                </span>
                <span style={styles.metaItem}>
                  <MapPin size={14} />
                  {request.location}
                </span>
                {request.preferredTimeline && (
                  <span style={styles.metaItem}>
                    <Clock size={14} />
                    {request.preferredTimeline}
                  </span>
                )}
              </div>

              <div style={styles.requestFooter}>
                <span style={styles.responseCount}>
                  {request.responses.length} response{request.responses.length !== 1 ? 's' : ''}
                </span>
                <span style={styles.timestamp}>
                  Posted {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#64748b'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.875rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    backgroundColor: 'white'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '0.875rem'
  },
  requestCard: {
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  userName: {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: '0.875rem'
  },
  userLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginTop: '0.125rem'
  },
  badges: {
    display: 'flex',
    gap: '0.5rem'
  },
  requestTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '0.75rem'
  },
  requestDescription: {
    color: '#64748b',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  requestMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: '#64748b'
  },
  requestFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  responseCount: {
    fontWeight: 600,
    color: '#3b82f6'
  },
  timestamp: {
    color: '#94a3b8'
  }
};

// Add hover effect
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  a.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Requests;
