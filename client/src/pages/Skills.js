import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillAPI } from '../services/api';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    location: '',
    minRating: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchSkills();
  }, []);

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

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.query) params.query = filters.query;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.minRating) params.minRating = filters.minRating;

      const response = await skillAPI.search(params);
      if (response.data.success) {
        setSkills(response.data.skills);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
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
    fetchSkills();
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      minRating: ''
    });
    setTimeout(() => fetchSkills(), 100);
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={styles.header}>
        <h1 style={styles.title}>Browse Skills</h1>
        <p style={styles.subtitle}>
          Discover talented individuals ready to share their expertise
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
                  placeholder="Search skills..."
                  value={filters.query}
                  onChange={handleFilterChange}
                  style={styles.searchInput}
                />
              </div>
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
              <label className="label">Location</label>
              <input
                type="text"
                name="location"
                className="input"
                placeholder="Any location"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label className="label">Minimum Rating</label>
              <select
                name="minRating"
                className="select"
                value={filters.minRating}
                onChange={handleFilterChange}
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
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

      {/* Skills Grid */}
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : skills.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
            No skills found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
          {skills.map((skill) => (
            <div key={skill._id} className="card" style={styles.skillCard}>
              <div style={styles.skillHeader}>
                <Link to={`/profile/${skill.userId._id}`} style={styles.userInfo}>
                  <img
                    src={skill.userId.profilePicture || `https://ui-avatars.com/api/?name=${skill.userId.fullName}&size=40&background=3b82f6&color=fff`}
                    alt={skill.userId.fullName}
                    style={styles.avatar}
                  />
                  <div>
                    <div style={styles.userName}>{skill.userId.fullName}</div>
                    {skill.userId.location && (
                      <div style={styles.userLocation}>
                        <MapPin size={12} />
                        {skill.userId.location}
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              <h3 style={styles.skillName}>{skill.skillName}</h3>
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
                {skill.category}
              </span>

              <p style={styles.skillDescription}>{skill.description}</p>

              <div style={styles.skillMeta}>
                <span className="badge badge-gray">{skill.experienceLevel}</span>
                <span style={styles.experience}>
                  {skill.yearsOfExperience} years
                </span>
                {skill.rating > 0 && (
                  <div style={styles.rating}>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span>{skill.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div style={styles.availability}>
                Available: {skill.availableFor}
              </div>
            </div>
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
  skillCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  skillHeader: {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none'
  },
  avatar: {
    width: '40px',
    height: '40px',
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
    marginBottom: '1rem',
    flex: 1
  },
  skillMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    fontSize: '0.75rem'
  },
  experience: {
    color: '#64748b'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginLeft: 'auto',
    fontWeight: 600,
    color: '#92400e'
  },
  availability: {
    fontSize: '0.75rem',
    color: '#64748b',
    paddingTop: '0.75rem',
    borderTop: '1px solid #f1f5f9'
  }
};

// Add hover effect
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .skill-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Skills;
