import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAPI, skillAPI } from '../services/api';
import { Plus, X } from 'lucide-react';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkill: '',
    category: '',
    urgencyLevel: 'Medium',
    location: 'Online',
    preferredTimeline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await requestAPI.create(formData);
      if (response.data.success) {
        navigate(`/requests/${response.data.request._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <div className="card">
        <h1 style={styles.title}>Create Help Request</h1>
        <p style={styles.subtitle}>
          Describe what you need help with and connect with skilled community members
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label className="label">Title *</label>
            <input
              type="text"
              name="title"
              className="input"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Need help with React website development"
              maxLength={200}
              required
            />
            <p style={styles.helpText}>{formData.title.length}/200 characters</p>
          </div>

          <div style={styles.formGroup}>
            <label className="label">Description *</label>
            <textarea
              name="description"
              className="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about what you need help with..."
              maxLength={2000}
              style={{ minHeight: '150px' }}
              required
            />
            <p style={styles.helpText}>{formData.description.length}/2000 characters</p>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div style={styles.formGroup}>
              <label className="label">Required Skill *</label>
              <input
                type="text"
                name="requiredSkill"
                className="input"
                value={formData.requiredSkill}
                onChange={handleChange}
                placeholder="e.g., Web Development, Graphic Design"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label className="label">Category *</label>
              <select
                name="category"
                className="select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div style={styles.formGroup}>
              <label className="label">Urgency Level</label>
              <select
                name="urgencyLevel"
                className="select"
                value={formData.urgencyLevel}
                onChange={handleChange}
              >
                <option value="Low">Low - Can wait</option>
                <option value="Medium">Medium - Within a week</option>
                <option value="High">High - Urgent</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label className="label">Location</label>
              <input
                type="text"
                name="location"
                className="input"
                value={formData.location}
                onChange={handleChange}
                placeholder="Online or specify city"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label className="label">Preferred Timeline (Optional)</label>
            <input
              type="text"
              name="preferredTimeline"
              className="input"
              value={formData.preferredTimeline}
              onChange={handleChange}
              placeholder="e.g., Within 2 weeks, ASAP, Flexible"
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Plus size={18} />
              {loading ? 'Creating...' : 'Create Request'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/requests')}
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: 1.6
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  helpText: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginTop: '0.25rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  }
};

export default CreateRequest;
