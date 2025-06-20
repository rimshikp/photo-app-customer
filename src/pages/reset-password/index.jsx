import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { noAuthApi } from "../../utils/api";
import styles from "./Reset.module.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const token = searchParams.get("token");
      
      if (!token) {
        throw new Error("Invalid reset link");
      }

      await noAuthApi.post("/users/reset-password", {
        token,
        password: formData.password
      });

      setSuccess(true);
      setTimeout(() => navigate("/sign-in"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <img src="https://workfotos.com/New-logo-white.png" alt="Logo" />
        </div>
        <p className={styles.loginSubtitle}>
          {success ? "Password reset successful!" : "Enter your new password"}
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && (
          <div className={styles.successMessage}>
            You will be redirected to login shortly...
          </div>
        )}

        {!success && (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                className={styles.loginInput}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles.loginInput}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner}></span> : "Reset Password"}
            </button>

            <p className={styles.signupLink}>
              Remember your password? <a href="/sign-in">Sign in</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}