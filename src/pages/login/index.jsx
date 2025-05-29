import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { noAuthApi } from '../../utils/api';
import styles from "./Login.module.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await noAuthApi.post('/users/login', formData);
      localStorage.setItem('authToken', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <img src="https://workalbums.com/New-logo-white.png" alt="Logo" />
        </div>
        <p className={styles.loginSubtitle}>Please enter your details</p>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>📧</span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className={styles.loginInput}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.loginInput}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.rememberForgot}>
            <label className={styles.rememberMe}>
              <input type="checkbox" disabled={loading} />
              Remember me
            </label>
            <a href="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner}></span>
            ) : (
              'Sign In'
            )}
          </button>

          <p className={styles.signupLink}>
            Don't have an account? <a href="/sign-up">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}