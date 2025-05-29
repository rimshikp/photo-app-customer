import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.number}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.message}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className={styles.button}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}