import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faTimes, 
  faChevronLeft, 
  faChevronRight,
  faHeart,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import styles from './Gallery.module.css';
import { api } from '../../utils/api';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filters, setFilters] = useState({
    event: '',
    priceMin: '',
    priceMax: '',
    sort: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await api.post('/photos/get_gallery', {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          eventId: filters.event,
          minPrice: filters.priceMin,
          maxPrice: filters.priceMax,
          sortBy: filters.sort === 'newest' ? 'createdAt' : 'price',
          sortOrder: filters.sort === 'newest' ? 'desc' : 'asc'
        });
        
        setPhotos(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [currentPage, searchQuery, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      event: '',
      priceMin: '',
      priceMax: '',
      sort: 'newest'
    });
    setCurrentPage(1);
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className={styles.container}>
      <div className={styles.galleryHeader}>
        <h1 className={styles.title}>Photo Gallery</h1>
        
        <div className={styles.controls}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </form>
          
          <button 
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Filters</span>
          </button>
        </div>
        
        {showFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <label>Event</label>
              <select 
                name="event"
                value={filters.event}
                onChange={handleFilterChange}
                className={styles.filterInput}
              >
                <option value="">All Events</option>
                <option value="event1">Wedding</option>
                <option value="event2">Portrait</option>
                <option value="event3">Landscape</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Price Range</label>
              <div className={styles.priceRange}>
                <input
                  type="number"
                  name="priceMin"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  className={styles.priceInput}
                />
                <span>to</span>
                <input
                  type="number"
                  name="priceMax"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  className={styles.priceInput}
                />
              </div>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Sort By</label>
              <select 
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className={styles.filterInput}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            
            <div className={styles.filterActions}>
              <button 
                className={styles.applyButton}
                onClick={applyFilters}
              >
                Apply Filters
              </button>
              <button 
                className={styles.resetButton}
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading photos...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className={styles.empty}>
          <p>No photos found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className={styles.galleryGrid}>
            {photos.map(photo => (
              <div key={photo._id} className={styles.galleryItem}>
                <div 
                  className={styles.photoContainer}
                  onClick={() => openLightbox(photo)}
                >
                  <img 
                    src={photo.watermarkImageUrl || photo.compressedImageUrl} 
                    alt={photo.metadata?.originalName || 'Gallery photo'}
                    className={styles.photo}
                  />
                  <div className={styles.photoOverlay}>
                    <div className={styles.photoInfo}>
                      <span className={styles.eventName}>{photo.event_id?.name || 'Untitled'}</span>
                      <span className={styles.price}>${photo.price.toFixed(2)}</span>
                    </div>
                    <div className={styles.photoActions}>
                      <button className={styles.likeButton}>
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button className={styles.cartButton}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </>
      )}
      
      {selectedPhoto && (
        <div className={styles.lightbox}>
          <div className={styles.lightboxContent}>
            <button 
              className={styles.closeLightbox}
              onClick={closeLightbox}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <div className={styles.lightboxImageContainer}>
              <img 
                src={selectedPhoto.originalImageUrl} 
                alt="Full size" 
                className={styles.lightboxImage}
              />
            </div>
            
            <div className={styles.lightboxInfo}>
              <h3>{selectedPhoto.event_id?.name || 'Untitled'}</h3>
              <p className={styles.lightboxPrice}>${selectedPhoto.price.toFixed(2)}</p>
              <p className={styles.lightboxDescription}>
                {selectedPhoto.metadata?.description || 'No description available'}
              </p>
              
              <div className={styles.lightboxActions}>
                <button className={styles.lightboxLikeButton}>
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Save to favorites</span>
                </button>
                <button className={styles.lightboxBuyButton}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>Purchase</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;