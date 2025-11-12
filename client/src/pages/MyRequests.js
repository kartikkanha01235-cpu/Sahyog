import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestAPI } from '../services/api';
import { Plus, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

const MyRequests = () => {
  const {  } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getMyRequests();
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (err) {
      setError('Error loading your requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <Clock size={20} color="#10b981" />;
      case 'In Progress':
        return <Clock size={20} color="#f59e0b" />;
      case 'Completed':
        return <CheckCircle size={20} color="#6366f1" />;
      case 'Closed':
        return <XCircle size={20} color="#94a3b8" />;
      default:
        return null;
    }
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

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Help Requests</h1>
          <p style={styles.subtitle}>
            Manage your help requests and track responses
          </p>
        </div>
        <Link to="/requests/create" className="btn btn-primary">
          <Plus size={18} />
          Create New Request
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
            You haven't created any help requests yet.
          </p>
          <Link to="/requests/create" className="btn btn-primary">
            <Plus size={18} />
            Create Your First Request
          </Link>
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
                <div style={styles.statusInfo}>
                  {getStatusIcon(request.status)}
                  <span className={`badge ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`badge ${getUrgencyBadge(request.urgencyLevel)}`}>
                    {request.urgencyLevel}
                  </span>
                  <span className="badge badge-primary">{request.category}</span>
                </div>
                <div style={styles.timestamp}>
                  Posted {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>

              <h3 style={styles.requestTitle}>{request.title}</h3>
              <p style={styles.requestDescription}>{request.description}</p>

              <div style={styles.requestFooter}>
                <div style={styles.responseInfo}>
                  <MessageSquare size={16} />
                  <span>{request.responses.length} response{request.responses.length !== 1 ? 's' : ''}</span>
                </div>
                {request.acceptedResponderId && (
                  <div style={styles.acceptedInfo}>
                    <CheckCircle size={16} color="#10b981" />
                    <span>Helper accepted</span>
                  </div>
                )}
                {request.status === 'Completed' && request.rating?.score && (
                  <div style={styles.ratedInfo}>
                    <span>Rated {request.rating.score}/5</span>
                  </div>
                )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    gap: '1rem'
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
  requestCard: {
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  statusInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#94a3b8'
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
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  requestFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #f1f5f9',
    fontSize: '0.875rem'
  },
  responseInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#3b82f6',
    fontWeight: 600
  },
  acceptedInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#10b981',
    fontWeight: 600
  },
  ratedInfo: {
    color: '#8b5cf6',
    fontWeight: 600
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

export default MyRequests;
