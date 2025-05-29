import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from "./Email.module.css";
import { noAuthApi } from "../../utils/api";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          throw new Error('Invalid verification link');
        }

        const response = await noAuthApi.post("/users/verify-email", {
          token,
        });
        console.log("Verification successful:", response.data);
        setSuccess(true);
        setTimeout(() => navigate('/sign-in'), 2000);
        
      } catch (err) {
        setError(err.response?.data?.message || 
                err.message || 
                'Email verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Verifying your email...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <h2>Verification Failed</h2>
            <p className={styles.errorText}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        ) : success ? (
          <div className={styles.successContainer}>
            <h2>Email Verified!</h2>
            <p>Your email has been successfully verified.</p>
            <p>Redirecting to login page...</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}