import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, Heart, TrendingUp, Search, Plus } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Connect, Learn, and Grow Together
          </h1>
          <p style={styles.heroSubtitle}>
            Join Sahyog - a community-driven platform where people share skills, 
            offer help, and build stronger connections through mutual support.
          </p>
          <div style={styles.heroButtons}>
            {isAuthenticated ? (
              <>
                <Link to="/requests/create" className="btn btn-primary" style={styles.heroButton}>
                  <Plus size={20} />
                  Create Help Request
                </Link>
                <Link to="/skills" className="btn btn-secondary" style={styles.heroButton}>
                  <Search size={20} />
                  Browse Skills
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary" style={styles.heroButton}>
                  Get Started
                </Link>
                <Link to="/skills" className="btn btn-secondary" style={styles.heroButton}>
                  Explore Skills
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Why Choose Sahyog?</h2>
          <div className="grid grid-cols-3" style={{ marginTop: '3rem' }}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Users size={32} />
              </div>
              <h3 style={styles.featureTitle}>Community Driven</h3>
              <p style={styles.featureText}>
                Connect with like-minded individuals who are eager to share their knowledge and learn from others.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <BookOpen size={32} />
              </div>
              <h3 style={styles.featureTitle}>Diverse Skills</h3>
              <p style={styles.featureText}>
                From technical expertise to creative talents, find help across multiple categories and skill levels.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Heart size={32} />
              </div>
              <h3 style={styles.featureTitle}>Mutual Support</h3>
              <p style={styles.featureText}>
                Build meaningful relationships through peer-to-peer assistance and collaborative problem-solving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <div className="container">
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div className="grid grid-cols-3" style={{ marginTop: '3rem' }}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Create Your Profile</h3>
              <p style={styles.stepText}>
                Sign in with Google and set up your profile with your skills and expertise.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Share or Request Help</h3>
              <p style={styles.stepText}>
                Post help requests or offer your skills to assist others in the community.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Build Your Reputation</h3>
              <p style={styles.stepText}>
                Earn reputation points through quality assistance and positive community feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div className="container" style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Join the Community?</h2>
          <p style={styles.ctaText}>
            Start sharing your skills and learning from others today.
          </p>
          {!isAuthenticated && (
            <Link to="/login" className="btn btn-primary" style={styles.ctaButton}>
              Sign In with Google
            </Link>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div className="container">
          <div className="grid grid-cols-3">
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <Users size={40} color="#3b82f6" />
              </div>
              <div style={styles.statNumber}>1000+</div>
              <div style={styles.statLabel}>Community Members</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <BookOpen size={40} color="#10b981" />
              </div>
              <div style={styles.statNumber}>500+</div>
              <div style={styles.statLabel}>Skills Shared</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <TrendingUp size={40} color="#8b5cf6" />
              </div>
              <div style={styles.statNumber}>2000+</div>
              <div style={styles.statLabel}>Successful Connections</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '5rem 0',
    color: 'white',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    lineHeight: 1.2
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.95,
    lineHeight: 1.6
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  heroButton: {
    fontSize: '1rem',
    padding: '0.875rem 2rem'
  },
  features: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    textAlign: 'center',
    color: '#1e293b'
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem'
  },
  featureIcon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1e293b'
  },
  featureText: {
    color: '#64748b',
    lineHeight: 1.6
  },
  howItWorks: {
    padding: '5rem 0',
    backgroundColor: '#f8fafc'
  },
  stepCard: {
    textAlign: 'center',
    padding: '2rem'
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    margin: '0 auto 1.5rem',
    background: '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 700
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1e293b'
  },
  stepText: {
    color: '#64748b',
    lineHeight: 1.6
  },
  cta: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white'
  },
  ctaContent: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '1rem'
  },
  ctaText: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.95
  },
  ctaButton: {
    fontSize: '1rem',
    padding: '0.875rem 2rem'
  },
  stats: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  statCard: {
    textAlign: 'center',
    padding: '2rem'
  },
  statIcon: {
    marginBottom: '1rem'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: '#64748b',
    fontSize: '1rem'
  }
};

export default Home;
