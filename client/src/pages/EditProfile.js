import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { Save, X } from 'lucide-react';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    languages: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        location: user.location || '',
        languages: user.languages ? user.languages.join(', ') : ''
      });
    }
  }, [user]);

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
    setSuccess('');

    try {
      const updateData = {
        bio: formData.bio,
        location: formData.location,
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang)
      };

      const response = await userAPI.updateProfile(updateData);
      
      if (response.data.success) {
        updateUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate(`/profile/${user._id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <div className="card">
        <h1 style={styles.title}>Edit Profile</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input"
              value={user?.fullName || ''}
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
            />
            <p style={styles.helpText}>Name is auto-filled from your Google account</p>
          </div>

          <div style={styles.formGroup}>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={user?.email || ''}
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
            />
            <p style={styles.helpText}>Email cannot be changed</p>
          </div>

          <div style={styles.formGroup}>
            <label className="label">Bio</label>
            <textarea
              name="bio"
              className="textarea"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p style={styles.helpText}>{formData.bio.length}/500 characters</p>
          </div>

          <div style={styles.formGroup}>
            <label className="label">Location/City</label>
            <input
              type="text"
              name="location"
              className="input"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, USA"
            />
          </div>

          <div style={styles.formGroup}>
            <label className="label">Languages</label>
            <input
              type="text"
              name="languages"
              className="input"
              value={formData.languages}
              onChange={handleChange}
              placeholder="e.g., English, Hindi, Spanish (comma separated)"
            />
            <p style={styles.helpText}>Separate multiple languages with commas</p>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
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

export default EditProfile;
