import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import '../styles/Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    tin: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user document in Firestore
      const trialStartDate = new Date();
      const trialEndDate = new Date(trialStartDate.getTime() + 14 * 24 * 60 * 60 * 1000);

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        businessName: formData.businessName,
        tin: formData.tin,
        email: formData.email,
        createdAt: new Date(),
        trialStartDate: trialStartDate,
        trialEndDate: trialEndDate,
        trialDaysLeft: 14,
        status: 'active_trial',
        selectedPlan: null,
        planStartDate: null,
        lang: 'am',
      });

      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="flag-stripe">
        <div className="fs-g"></div>
        <div className="fs-y"></div>
        <div className="fs-r"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="logo">
            <div className="logo-icon">AH</div>
            <div>
              <div>ARIF HISSAB</div>
              <div className="am">አሪፍ ሂሳብ</div>
            </div>
          </div>

          <h2>📝 አሁኑኑ ይመዝገቡ / Register</h2>
          <p className="am">14 ቀናት ነጻ ይሞክሩ</p>
          <p className="trial-badge">🎉 14 Days Free Trial Included!</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>🏢 Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your Business"
                required
              />
            </div>

            <div className="form-group">
              <label>🔢 TIN (Tax ID)</label>
              <input
                type="text"
                name="tin"
                value={formData.tin}
                onChange={handleChange}
                placeholder="Your Tax ID"
              />
            </div>

            <div className="form-group">
              <label>📧 Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>🔑 Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label>🔑 Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'መለያ ይፍጠሩ / Register'}
            </button>
          </form>

          <div className="auth-link">
            <p className="am">ቀድሞ መለያ አለዎት?</p>
            <p>Already have an account? <Link to="/login">Log in here</Link></p>
          </div>

          <div className="back-link">
            <Link to="/">← ወደ ዋናው ገጽ / Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
