import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
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

          <h2>🔐 ወደ ሂሳብዎ ገባ / Log In</h2>
          <p className="am">የሂሳብ ቁልፍ ቀልዱን ይተይቡ</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>📧 Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>🔑 Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'ወደ ውስጥ ይግቡ / Log In'}
            </button>
          </form>

          <div className="auth-link">
            <p className="am">መለያ የሉም?</p>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>

          <div className="back-link">
            <Link to="/">← ወደ ዋናው ገጽ / Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
