import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestAPI } from '../services/api';
import { MapPin, Clock, AlertCircle, User, MessageSquare, CheckCircle, Star } from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState({ score: 5, feedback: '' });

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getById(id);
      if (response.data.success) {
        setRequest(response.data.request);
      }
    } catch (err) {
      setError('Error loading request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!responseMessage.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await requestAPI.respond(id, responseMessage);
      if (response.data.success) {
        setRequest(response.data.request);
        setResponseMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptResponder = async (responderId) => {
    try {
      const response = await requestAPI.acceptResponder(id, responderId);
      if (response.data.success) {
        setRequest(response.data.request);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error accepting responder');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await requestAPI.update(id, { status: newStatus });
      if (response.data.success) {
        setRequest(response.data.request);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleRating = async (e) => {
    e.preventDefault();
    try {
      await requestAPI.rate(id, rating.score, rating.feedback);
      fetchRequest();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting rating');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (error && !request) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const isOwner = user && request && user._id === request.requesterId._id;
  const hasResponded = user && request && request.responses.some(r => r.userId._id === user._id);

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

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        {/* Main Content */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card">
            {error && <div className="error-message">{error}</div>}

            <div style={styles.header}>
              <div>
                <h1 style={styles.title}>{request.title}</h1>
                <div style={styles.badges}>
                  <span className={`badge ${getStatusBadge(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`badge ${getUrgencyBadge(request.urgencyLevel)}`}>
                    {request.urgencyLevel} Priority
                  </span>
                  <span className="badge badge-primary">{request.category}</span>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.description}>{request.description}</p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Details</h3>
              <div style={styles.detailsList}>
                <div style={styles.detailItem}>
                  <strong>Required Skill:</strong> {request.requiredSkill}
                </div>
                <div style={styles.detailItem}>
                  <MapPin size={16} />
                  <strong>Location:</strong> {request.location}
                </div>
                {request.preferredTimeline && (
                  <div style={styles.detailItem}>
                    <Clock size={16} />
                    <strong>Timeline:</strong> {request.preferredTimeline}
                  </div>
                )}
                <div style={styles.detailItem}>
                  <strong>Posted:</strong> {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && request.status === 'Open' && (
              <div style={styles.section}>
                <button
                  onClick={() => handleStatusUpdate('Closed')}
                  className="btn btn-secondary"
                >
                  Close Request
                </button>
              </div>
            )}

            {isOwner && request.status === 'In Progress' && (
              <div style={styles.section}>
                <button
                  onClick={() => handleStatusUpdate('Completed')}
                  className="btn btn-success"
                >
                  <CheckCircle size={18} />
                  Mark as Completed
                </button>
              </div>
            )}

            {/* Rating Form */}
            {isOwner && request.status === 'Completed' && !request.rating?.score && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Rate the Help Received</h3>
                <form onSubmit={handleRating}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Rating (1-5 stars)</label>
                    <select
                      className="select"
                      value={rating.score}
                      onChange={(e) => setRating({ ...rating, score: parseInt(e.target.value) })}
                    >
                      {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Feedback (optional)</label>
                    <textarea
                      className="textarea"
                      value={rating.feedback}
                      onChange={(e) => setRating({ ...rating, feedback: e.target.value })}
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <Star size={18} />
                    Submit Rating
                  </button>
                </form>
              </div>
            )}

            {/* Display Rating */}
            {request.rating?.score && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Rating</h3>
                <div style={styles.ratingDisplay}>
                  <div style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i < request.rating.score ? '#fbbf24' : 'none'}
                        color="#fbbf24"
                      />
                    ))}
                  </div>
                  {request.rating.feedback && (
                    <p style={styles.ratingFeedback}>{request.rating.feedback}</p>
                  )}
                </div>
              </div>
            )}

            {/* Responses */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                Responses ({request.responses.length})
              </h3>

              {request.responses.length === 0 ? (
                <p style={styles.emptyState}>No responses yet. Be the first to help!</p>
              ) : (
                <div style={styles.responsesList}>
                  {request.responses.map((response) => (
                    <div key={response._id} style={styles.responseCard}>
                      <div style={styles.responseHeader}>
                        <Link to={`/profile/${response.userId._id}`} style={styles.responderInfo}>
                          <img
                            src={response.userId.profilePicture || `https://ui-avatars.com/api/?name=${response.userId.fullName}&size=40&background=3b82f6&color=fff`}
                            alt={response.userId.fullName}
                            style={styles.responderAvatar}
                          />
                          <div>
                            <div style={styles.responderName}>{response.userId.fullName}</div>
                            <div style={styles.responseTime}>
                              {new Date(response.respondedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </Link>
                        {isOwner && request.status === 'Open' && !request.acceptedResponderId && (
                          <button
                            onClick={() => handleAcceptResponder(response.userId._id)}
                            className="btn btn-primary btn-sm"
                          >
                            Accept
                          </button>
                        )}
                        {request.acceptedResponderId === response.userId._id && (
                          <span className="badge badge-success">Accepted</span>
                        )}
                      </div>
                      <p style={styles.responseMessage}>{response.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Response Form */}
            {user && !isOwner && !hasResponded && (request.status === 'Open' || request.status === 'In Progress') && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Offer Your Help</h3>
                <form onSubmit={handleRespond}>
                  <textarea
                    className="textarea"
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Explain how you can help..."
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ marginTop: '1rem' }}
                  >
                    <MessageSquare size={18} />
                    {submitting ? 'Submitting...' : 'Submit Response'}
                  </button>
                </form>
              </div>
            )}

            {hasResponded && (
              <div className="success-message">
                You have already responded to this request.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ gridColumn: 'span 1' }}>
          <div className="card">
            <h3 style={styles.sidebarTitle}>Requester</h3>
            <Link to={`/profile/${request.requesterId._id}`} style={styles.requesterCard}>
              <img
                src={request.requesterId.profilePicture || `https://ui-avatars.com/api/?name=${request.requesterId.fullName}&size=80&background=3b82f6&color=fff`}
                alt={request.requesterId.fullName}
                style={styles.requesterAvatar}
              />
              <h4 style={styles.requesterName}>{request.requesterId.fullName}</h4>
              {request.requesterId.location && (
                <div style={styles.requesterLocation}>
                  <MapPin size={14} />
                  {request.requesterId.location}
                </div>
              )}
              {request.requesterId.reputationScore > 0 && (
                <div style={styles.reputation}>
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  <span>{request.requesterId.averageRating || 0} rating</span>
                </div>
              )}
              {request.requesterId.bio && (
                <p style={styles.requesterBio}>{request.requesterId.bio}</p>
              )}
            </Link>
          </div>

          {request.acceptedResponderId && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={styles.sidebarTitle}>Accepted Helper</h3>
              <Link to={`/profile/${request.acceptedResponderId._id}`} style={styles.requesterCard}>
                <img
                  src={request.acceptedResponderId.profilePicture || `https://ui-avatars.com/api/?name=${request.acceptedResponderId.fullName}&size=80&background=10b981&color=fff`}
                  alt={request.acceptedResponderId.fullName}
                  style={styles.requesterAvatar}
                />
                <h4 style={styles.requesterName}>{request.acceptedResponderId.fullName}</h4>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e2e8f0'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  badges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  section: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #f1f5f9'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  description: {
    color: '#475569',
    lineHeight: 1.6,
    fontSize: '1rem'
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64748b',
    fontSize: '0.875rem'
  },
  emptyState: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '2rem',
    fontStyle: 'italic'
  },
  responsesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  responseCard: {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0'
  },
  responseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  responderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none'
  },
  responderAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  responderName: {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: '0.875rem'
  },
  responseTime: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  responseMessage: {
    color: '#475569',
    fontSize: '0.875rem',
    lineHeight: 1.6
  },
  sidebarTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  requesterCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    textAlign: 'center'
  },
  requesterAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '0.75rem'
  },
  requesterName: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  requesterLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: '#64748b',
    marginBottom: '0.5rem'
  },
  reputation: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: '#92400e',
    fontWeight: 600,
    marginBottom: '0.75rem'
  },
  requesterBio: {
    fontSize: '0.75rem',
    color: '#64748b',
    lineHeight: 1.5,
    marginTop: '0.75rem'
  },
  ratingDisplay: {
    padding: '1rem',
    backgroundColor: '#fef3c7',
    borderRadius: '0.5rem'
  },
  stars: {
    display: 'flex',
    gap: '0.25rem',
    marginBottom: '0.75rem'
  },
  ratingFeedback: {
    color: '#92400e',
    fontSize: '0.875rem',
    lineHeight: 1.6
  }
};

export default RequestDetail;
