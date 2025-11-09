import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      login(token);
      navigate('/');
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="loading">
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: '#64748b' }}>Completing sign in...</p>
    </div>
  );
};

export default AuthCallback;
