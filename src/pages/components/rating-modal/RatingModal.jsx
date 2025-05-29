import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "../photo-card/PhotoCard.module.css";

const RatingModal = ({ currentRating, onClose, myrate, onSubmit }) => {
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState(0);
  const modalRef = useRef(null);

  const getStarColor = (star) => {
    if (myrate > 0 && star <= myrate) {
      return "#FFD700";
    }
    const ratingValue = hoverRating || rating;
    return ratingValue >= star ? "#FFD700" : "#e0e0e0";
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.ratingModal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h3>{myrate > 0 ? "Update your rating" : "Rate this photo"}</h3>
          {/* <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button> */}
        </div>

        <div className={styles.modalStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={faStar}
              className={styles.modalStar}
              style={{
                color: getStarColor(star),
                cursor: myrate > 0 ? "default" : "pointer",
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        {myrate === 0 && (
          <div className={styles.modalActions}>
            <button className={styles.modalCancel} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.modalSubmit}
              onClick={() => onSubmit(rating)}
            >
              Submit Rating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingModal;