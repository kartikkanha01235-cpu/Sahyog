import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { skillAPI } from '../services/api';
import { Plus, X } from 'lucide-react';

const AddSkill = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    skillName: '',
    category: '',
    description: '',
    experienceLevel: 'Intermediate',
    yearsOfExperience: 0,
    availableFor: 'Both'
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
      const response = await skillAPI.create(formData);
      if (response.data.success) {
        navigate(`/profile/${user._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <div className="card">
        <h1 style={styles.title}>Add New Skill</h1>
        <p style={styles.subtitle}>
          Share your expertise with the community
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label className="label">Skill Name *</label>
            <input
              type="text"
              name="skillName"
              className="input"
              value={formData.skillName}
              onChange={handleChange}
              placeholder="e.g., Web Development, Guitar Lessons"
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

          <div style={styles.formGroup}>
            <label className="label">Description *</label>
            <textarea
              name="description"
              className="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your skill and what you can help with..."
              maxLength={500}
              required
            />
            <p style={styles.helpText}>{formData.description.length}/500 characters</p>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div style={styles.formGroup}>
              <label className="label">Experience Level</label>
              <select
                name="experienceLevel"
                className="select"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label className="label">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                className="input"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                max="50"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label className="label">Available For</label>
            <select
              name="availableFor"
              className="select"
              value={formData.availableFor}
              onChange={handleChange}
            >
              <option value="Online">Online Only</option>
              <option value="In-Person">In-Person Only</option>
              <option value="Both">Both Online & In-Person</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Plus size={18} />
              {loading ? 'Adding...' : 'Add Skill'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/profile/${user._id}`)}
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
    marginBottom: '2rem'
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

export default AddSkill;
