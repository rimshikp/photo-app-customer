import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from './FilterButtons.module.css';
import { api } from '../../../utils/api';


const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.post('/events/allevents');
        setCategories(response?.data?.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin />
        <span>Loading models...</span>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>Error loading models: {error}</div>;
  }

  return (
    <div className={styles.filterButtons}>
      <button
        onClick={() => onFilterChange('all')}
        className={clsx(styles.filterButton, activeFilter.includes('all') && styles.activeFilter)}
      >
        All
      </button>
      
      {categories.map(category => (
        <button
          key={category._id}
          onClick={() => onFilterChange(category._id)}
          className={clsx(
            styles.filterButton,
            activeFilter.includes(category._id) && styles.activeFilter
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;