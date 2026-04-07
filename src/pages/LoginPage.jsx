import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStudent, loginAdmin, getGoogleLoginUrl } from '../api';
import { useUser } from '../context/UserContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useUser();

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/student');
    }

    // Check for OAuth2 redirect params in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      login(token);
    }

    // Fix: Manually render reCAPTCHA if the global grecaptcha is available
    const initCaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render) {
        const captchaContainer = document.getElementById('recaptcha-container');
        if (captchaContainer && captchaContainer.innerHTML === "") {
          window.grecaptcha.render('recaptcha-container', {
            'sitekey': import.meta.env.VITE_RECAPTCHA_SITE_KEY
          });
        }
      } else {
        setTimeout(initCaptcha, 500);
      }
    };
    initCaptcha();
  }, [user, navigate, login]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt started for role:', role);
    console.log('Payload:', { email, password });
    
    const captchaToken = window.grecaptcha ? window.grecaptcha.getResponse() : null;
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }

    setLoading(true);

    try {
      let result;
      if (role === 'student') {
        result = await loginStudent(email, password, captchaToken);
      } else {
        result = await loginAdmin(email, password, captchaToken);
      }

      if (result.success && result.token) {
        await login(result.token);
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login Failed with error:', err);
      setError('Failed to connect to server. Check your backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h1 className="auth-title">UniSched</h1>
        <p className="auth-subtitle">Sign in to manage your timetable</p>

        {error && <div className="error-message">{error}</div>}

        <div className="role-selector">
          <button 
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => { setRole('student'); setError(''); }}
          >
            Student
          </button>
          <button 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => { setRole('admin'); setError(''); }}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder={role === 'student' ? 'student@university.edu' : 'admin@university.edu'}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>

          <div 
            id="recaptcha-container"
            style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', minHeight: '78px' }}
          ></div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : `Sign In as ${role === 'student' ? 'Student' : 'Admin'}`}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button type="button" onClick={handleGoogleLogin} className="google-login-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Sign in with Google
        </button>

        <div className="auth-footer">
          {role === 'student' && (
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          )}
          <p className="docs-link"><Link to="/api-docs">View API Documentation</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
