import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Zap } from 'lucide-react';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '10px 0',
      color: 'white'
    },
    googleButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 24px',
      marginTop: '20px',
      backgroundColor: 'white',
      color: '#757575',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#f8fafc',
        borderColor: '#cbd5e1',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: 'white' }}>Welcome to Sahyog</h1>
      <p style={{ color: 'white' }}>Login to continue to your account</p>
      
      <div style={{ margin: '20px 0' }}>
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
        Continue with Google
      </button>
    </div>
  );
};

export default Login;