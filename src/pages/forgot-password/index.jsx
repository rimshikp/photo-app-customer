import { useState } from 'react';
import { noAuthApi } from '../../utils/api';
import styles from "./Forgot.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await noAuthApi.post('/users/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 
              'Password reset failed. Please try again.');
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
        
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.subtitle}>
          {success 
            ? "We've sent a password reset link to your email"
            : "Enter your email to receive a reset link"}
        </p>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            {'Check your email inbox for instructions to reset your password.'}
          </div>
        )} 
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>📧</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className={styles.loginInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <p className={styles.signupLink}>
              Remember your password? <a href="/sign-in" style={{fontWeight:900}}>Login</a>
            </p>
          </form>
        
      </div>
    </div>
  );
}