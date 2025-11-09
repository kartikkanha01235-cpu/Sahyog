import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Users, Shield, Zap } from 'lucide-react';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome to Sahyog</h1>
          <p style={styles.subtitle}>
            Join our community of skill-sharers and helpers
          </p>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <Users size={24} color="#3b82f6" />
            <span>Connect with community</span>
          </div>
          <div style={styles.feature}>
            <Shield size={24} color="#10b981" />
            <span>Secure authentication</span>
          </div>
          <div style={styles.feature}>
            <Zap size={24} color="#8b5cf6" />
            <span>Quick and easy setup</span>
          </div>
        </div>

        <button onClick={handleGoogleLogin} style={styles.googleButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '12px' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p style={styles.terms}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem'
  },
  loginBox: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '3rem',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1rem'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.75rem'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#475569',
    fontSize: '0.875rem',
    fontWeight: 500
  },
  googleButton: {
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
  },
  terms: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#94a3b8',
    lineHeight: 1.5
  }
};

// Add hover effect
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  button:hover {
    background-color: #f8fafc !important;
    border-color: #cbd5e1 !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Login;
