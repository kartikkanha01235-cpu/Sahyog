import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Plus, FileText, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>Sahyog</span>
        </Link>

        {/* Desktop Menu */}
        <div style={styles.desktopMenu}>
          <Link to="/skills" style={styles.navLink}>
            <Search size={18} />
            Browse Skills
          </Link>
          <Link to="/requests" style={styles.navLink}>
            <FileText size={18} />
            Help Requests
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/requests/create" className="btn btn-primary" style={{ marginLeft: '1rem' }}>
                <Plus size={18} />
                Create Request
              </Link>
              <div className="user-menu" style={styles.userMenu}>
                <img 
                  src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName}&background=3b82f6&color=fff`}
                  alt={user?.fullName}
                  style={styles.avatar}
                />
                <div className="dropdown" style={styles.dropdown}>
                  <Link to={`/profile/${user?._id}`} className="dropdown-item" style={styles.dropdownItem}>
                    <User size={16} />
                    My Profile
                  </Link>
                  <Link to="/my-requests" className="dropdown-item" style={styles.dropdownItem}>
                    <FileText size={16} />
                    My Requests
                  </Link>
                  <Link to="/skills/add" className="dropdown-item" style={styles.dropdownItem}>
                    <Plus size={16} />
                    Add Skill
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item" style={styles.dropdownItem}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ marginLeft: '1rem' }}>
              Sign In with Google
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          style={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/skills" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
            Browse Skills
          </Link>
          <Link to="/requests" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
            Help Requests
          </Link>
          {isAuthenticated ? (
            <>
              <Link to={`/profile/${user?._id}`} style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                My Profile
              </Link>
              <Link to="/my-requests" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                My Requests
              </Link>
              <Link to="/skills/add" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                Add Skill
              </Link>
              <Link to="/requests/create" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                Create Request
              </Link>
              <button onClick={handleLogout} style={styles.mobileLink}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#3b82f6'
  },
  logoText: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  navLink: {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: 500,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.2s'
  },
  userMenu: {
    position: 'relative',
    marginLeft: '1rem'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px solid #e2e8f0'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    border: '1px solid #e2e8f0',
    minWidth: '200px',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s',
    zIndex: 100
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#475569',
    fontSize: '0.875rem',
    width: '100%',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s'
  },
  mobileMenuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#475569'
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    padding: '1rem',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: 'white'
  },
  mobileLink: {
    padding: '0.75rem',
    textDecoration: 'none',
    color: '#475569',
    fontSize: '0.875rem',
    fontWeight: 500,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%'
  }
};

// Add hover effect for dropdown
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .user-menu:hover .dropdown {
    opacity: 1 !important;
    visibility: visible !important;
  }
  .dropdown-item:hover {
    background-color: #f8fafc !important;
  }
  .nav-link:hover {
    color: #3b82f6 !important;
  }
  @media (max-width: 768px) {
    .desktop-menu {
      display: none !important;
    }
    .mobile-menu-button {
      display: block !important;
    }
    .mobile-menu {
      display: flex !important;
    }
  }
`;
document.head.appendChild(styleSheet);

// Add classes for hover effects
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (min-width: 769px) {
      .mobile-menu-button { display: none !important; }
      .mobile-menu { display: none !important; }
    }
    @media (max-width: 768px) {
      .desktop-menu { display: none !important; }
      .mobile-menu-button { display: block !important; }
    }
  `;
  document.head.appendChild(style);
}

export default Navbar;
