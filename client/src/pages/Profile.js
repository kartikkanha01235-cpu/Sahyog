import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, skillAPI } from '../services/api';
import { MapPin, Calendar, Star, Edit, Award, BookOpen, FileText } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [profileRes, skillsRes, statsRes] = await Promise.all([
        userAPI.getProfile(id),
        skillAPI.getByUser(id),
        userAPI.getStats(id)
      ]);

      if (profileRes.data.success) {
        setUser(profileRes.data.user);
      }
      if (skillsRes.data.success) {
        setSkills(skillsRes.data.skills);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      setError('Error loading profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (error || !user) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div className="error-message">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        {/* Left Column - Profile Info */}
        <div style={{ gridColumn: 'span 1' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <img
              src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.fullName}&size=200&background=3b82f6&color=fff`}
              alt={user.fullName}
              style={styles.profileImage}
            />
            <h1 style={styles.name}>{user.fullName}</h1>
            
            {user.location && (
              <div style={styles.infoItem}>
                <MapPin size={16} />
                <span>{user.location}</span>
              </div>
            )}
            
            <div style={styles.infoItem}>
              <Calendar size={16} />
              <span>Member since {new Date(user.memberSince).toLocaleDateString()}</span>
            </div>

            {user.averageRating > 0 && (
              <div style={styles.rating}>
                <Star size={20} fill="#fbbf24" color="#fbbf24" />
                <span style={styles.ratingText}>
                  {user.averageRating} ({user.totalRatings} reviews)
                </span>
              </div>
            )}

            {isOwnProfile && (
              <Link to="/profile/edit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                <Edit size={18} />
                Edit Profile
              </Link>
            )}
          </div>

          {/* Stats Card */}
          {stats && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={styles.cardTitle}>Statistics</h3>
              <div style={styles.statsList}>
                <div style={styles.statItem}>
                  <BookOpen size={20} color="#3b82f6" />
                  <div>
                    <div style={styles.statValue}>{stats.skillsOffered}</div>
                    <div style={styles.statLabel}>Skills Offered</div>
                  </div>
                </div>
                <div style={styles.statItem}>
                  <FileText size={20} color="#10b981" />
                  <div>
                    <div style={styles.statValue}>{stats.requestsCreated}</div>
                    <div style={styles.statLabel}>Requests Created</div>
                  </div>
                </div>
                <div style={styles.statItem}>
                  <Award size={20} color="#8b5cf6" />
                  <div>
                    <div style={styles.statValue}>{stats.requestsHelped}</div>
                    <div style={styles.statLabel}>People Helped</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Bio and Skills */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* Bio */}
          <div className="card">
            <h2 style={styles.sectionTitle}>About</h2>
            <p style={styles.bio}>
              {user.bio || 'No bio provided yet.'}
            </p>

            {user.languages && user.languages.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={styles.subsectionTitle}>Languages</h3>
                <div style={styles.tagList}>
                  {user.languages.map((lang, index) => (
                    <span key={index} className="badge badge-gray">{lang}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>Skills Offered</h2>
              {isOwnProfile && (
                <Link to="/skills/add" className="btn btn-primary btn-sm">
                  Add Skill
                </Link>
              )}
            </div>

            {skills.length === 0 ? (
              <p style={styles.emptyState}>No skills added yet.</p>
            ) : (
              <div className="grid grid-cols-1" style={{ gap: '1rem', marginTop: '1rem' }}>
                {skills.map((skill) => (
                  <div key={skill._id} style={styles.skillCard}>
                    <div style={styles.skillHeader}>
                      <div>
                        <h3 style={styles.skillName}>{skill.skillName}</h3>
                        <span className="badge badge-primary">{skill.category}</span>
                      </div>
                      <span className="badge badge-gray">{skill.experienceLevel}</span>
                    </div>
                    <p style={styles.skillDescription}>{skill.description}</p>
                    <div style={styles.skillFooter}>
                      <span style={styles.skillMeta}>
                        {skill.yearsOfExperience} years experience
                      </span>
                      <span style={styles.skillMeta}>
                        Available: {skill.availableFor}
                      </span>
                      {skill.rating > 0 && (
                        <div style={styles.skillRating}>
                          <Star size={14} fill="#fbbf24" color="#fbbf24" />
                          <span>{skill.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 1rem',
    border: '4px solid #f1f5f9'
  },
  name: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#64748b',
    fontSize: '0.875rem',
    marginBottom: '0.5rem'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#fef3c7',
    borderRadius: '0.5rem'
  },
  ratingText: {
    fontWeight: 600,
    color: '#92400e'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#64748b'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '1rem'
  },
  bio: {
    color: '#475569',
    lineHeight: 1.6
  },
  subsectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '0.75rem'
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  emptyState: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '2rem',
    fontStyle: 'italic'
  },
  skillCard: {
    padding: '1.25rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    backgroundColor: '#f8fafc'
  },
  skillHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem'
  },
  skillName: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  skillDescription: {
    color: '#64748b',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    marginBottom: '0.75rem'
  },
  skillFooter: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: '#64748b'
  },
  skillMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  skillRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginLeft: 'auto',
    fontWeight: 600,
    color: '#92400e'
  }
};

export default Profile;
