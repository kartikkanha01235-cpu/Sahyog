import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SkillDetail = () => {
  const {  } = useParams();
  const navigate = useNavigate();

  // This is a placeholder - you can expand this later
  React.useEffect(() => {
    // Redirect to skills page for now
    navigate('/skills');
  }, [navigate]);

  return (
    <div className="loading">
      <div className="spinner"></div>
    </div>
  );
};

export default SkillDetail;
