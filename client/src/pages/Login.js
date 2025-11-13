import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authAPI.login({ email, password });
      navigate('/dashboard'); // or your desired redirect path
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // This should be your Google OAuth URL
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
    },
    formContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      maxWidth: '400px',
      margin: '0 auto',
    },
    logo: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      color: '#2563eb',
    },
    form: {
      width: '100%',
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      textAlign: 'center',
      color: '#1e293b',
    },
    inputGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#475569',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      color: '#1e293b',
      backgroundColor: '#f8fafc',
      '&:focus': {
        outline: 'none',
        ring: '2px',
        ringColor: '#2563eb',
        borderColor: '#2563eb',
      },
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '1rem',
      '&:hover': {
        backgroundColor: '#1d4ed8',
      },
      '&:disabled': {
        opacity: 0.7,
        cursor: 'not-allowed',
      },
    },
    googleButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      marginTop: '1rem',
      backgroundColor: 'white',
      color: '#1e293b',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#f8fafc',
      },
    },
    error: {
      color: '#dc2626',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
      textAlign: 'center',
    },
    signupLink: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#475569',
    },
    link: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: '500',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logo}>Sahyog</div>
        <div style={styles.form}>
          <h1 style={styles.title}>Welcome back</h1>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
                placeholder="Enter your password"
                minLength="6"
              />
            </div>
            
            <button
              type="submit"
              style={styles.button}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '1rem 0' }}>or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={styles.googleButton}
          >
            <FcGoogle style={{ marginRight: '0.5rem', fontSize: '1.25rem' }} />
            Continue with Google
          </button>

          <div style={styles.signupLink}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;