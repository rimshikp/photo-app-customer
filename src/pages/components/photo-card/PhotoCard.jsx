import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faThumbsUp,
  faShoppingCart,
  faEye,
  faDownload,
  faStar,
  faCheck,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";

import clsx from "clsx";
import styles from "./PhotoCard.module.css";
import { api } from "../../../utils/api";
import RatingModal from "../rating-modal/RatingModal";
import { backendUrl, razorPayKey } from "../../../utils/config";
import defaultProfile from "../../../assets/profile-icon.png";

export const handleFormats = (photo) => {
  return {
    id: photo._id,
    title: photo?.title,
    photographer: photo?.uploaded_by?.full_name || "Unknown",
    event: photo?.uploaded_by?.profile ? "Portfolio" : "Nature",
    price: photo?.price,
    rating: photo.averageRating || 0,
    myRatings: photo?.myRatings || 0,
    likesCount: photo.likesCount || 0,
    isPurchased: photo.isPurchased || 0,
    likesUsers: photo.likesUsers || [],
    imageUrl: photo?.watermarkImageUrl,
    originalimageUrl: photo?.originalImageUrl,
    ratingsCount: photo?.ratingsCount,
    isLike: photo?.isLike,
    isFavorite: photo?.isFavorites,
  };
};

const PhotoCard = ({
  photo: propPhoto,
  onSelect,
  isSelected,
  handleRefresh,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [photo, setPhoto] = useState(propPhoto);
  const shareRef = useRef(null);
  useEffect(() => {
    setPhoto(propPhoto);
  }, [propPhoto]);

  const [isFavorite, setIsFavorite] = useState();
  const [isLiked, setIsLiked] = useState();
  const [showViewer, setShowViewer] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [likes, setLikes] = useState();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [likedUsers, setLikedUsers] = useState();
  const [averageRating, setAverageRating] = useState();
  const [ratingsCount, setRatingsCount] = useState();
  const [myrate, setRatingMyrate] = useState();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isPurchased, setIsPurchased] = useState(0);

  useEffect(() => {
    setIsFavorite(photo?.isFavorite);
    setIsLiked(photo?.isLike);
    setLikes(photo?.likesCount || 0);
    setLikedUsers(photo?.likesUsers || []);
    setAverageRating(photo?.rating || 0);
    setRatingsCount(photo?.ratingsCount || 0);
    setRatingMyrate(photo?.myRatings || 0);
    setIsPurchased(photo?.isPurchased || 0);
  }, [photo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    };
    if (showShareOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareOptions]);

  useEffect(() => {
    const loadScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error("Razorpay script failed to load");
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadScript();
  }, []);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api
          .post("/photos/remove-favorites", { photo_id: photo.id })
          .then((res) => {
            handleRefresh(photo.id);
          });
      } else {
        await api
          .post("/photos/add-favorites", { photo_id: photo.id })
          .then((res) => {
            handleRefresh(photo.id);
          });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#4CAF50";
    if (rating >= 3) return "#8BC34A";
    if (rating >= 2) return "#FFC107";
    if (rating >= 1) return "#FF9800";
    return "#fff";
  };

  const handleLike = async () => {
    try {
      const newLikeStatus = !isLiked;

      if (newLikeStatus) {
        await api
          .post("/photos/add-likes", { photo_id: photo.id })
          .then((res) => {
            handleRefresh(photo.id);
          });
        setLikedUsers([...likedUsers]);
      } else {
        await api
          .post("/photos/remove-likes", { photo_id: photo.id })
          .then((res) => {
            handleRefresh(photo.id);
          });
        setLikedUsers(likedUsers.filter((user) => user.name !== "You"));
      }

      setIsLiked(newLikeStatus);
      setLikes(newLikeStatus ? likes + 1 : likes - 1);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareOnPlatform = (platform) => {
    const shareUrl = photo.imageUrl;
    const shareText = `Check out this amazing photo "${photo.title}" by ${photo.photographer}`;

    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(
          `${shareText} ${shareUrl}`
        )}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert("Link copied to clipboard!");
        setShowShareOptions(false);
        return;
      default:
        break;
    }

    window.open(shareLink, "_blank");
    setShowShareOptions(false);
  };

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      const orderResponse = await api.post("/payments/create", {
        photoIds: [photo.id],
        currency: "INR",
      });

      const orderData = orderResponse?.data?.data;
      const options = {
        key: razorPayKey,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        order_id: orderData.razorpay_order_id,
        name: "Work Fotos",
        description: `Purchase of ${photo.title}`,
        image: photo.imageUrl,
        handler: async function (response) {
          try {
            const verificationResponse = await api.post("/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: orderData.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            handleRefresh(photo.id);
            setIsPurchasing(false);
          } catch (verificationError) {
            setIsPurchasing(false);
            console.error("Payment verification failed:", verificationError);
          }
        },
        prefill: {
          name: user?.full_name || "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#4299e1",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsPurchasing(false);
    } catch (error) {
      setIsPurchasing(false);
      console.error("Purchase failed:", error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${backendUrl}/api/photos/download?photo_id=${encodeURIComponent(
      photo.id
    )}&user=${encodeURIComponent(user._id)}`;
    link.download = `${photo.title.replace(/\s+/g, "_")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRatingClick = () => {
    if (!user) return;
    setShowRatingModal(true);
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FontAwesomeIcon
        key={star}
        icon={faStar}
        className={styles.star}
        style={{
          color: rating >= star ? getRatingColor(rating) : "#e0e0e0",
          cursor: "pointer",
        }}
        onClick={handleRatingClick}
      />
    ));
  };

  const handleRatingSubmit = async (rating) => {
    try {
      await api
        .post("/photos/add-rating", {
          photo_id: photo.id,
          rating: rating,
        })
        .then((res) => {
          handleRefresh(photo.id);
        });

      const newRatingsCount = ratingsCount + 1;
      const newAverageRating =
        (averageRating * ratingsCount + rating) / newRatingsCount;

      setUserRating(rating);
      setAverageRating(parseFloat(newAverageRating.toFixed(1)));
      setRatingsCount(newRatingsCount);
      setShowRatingModal(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className={clsx(styles.card, isSelected && styles.cardSelected)}>
      {isSelected && (
        <div className={styles.selectedBadge}>
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}

      <div className={styles.imageContainer}>
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className={styles.image}
          onClick={() => setShowViewer(true)}
        />

        <div className={styles.actionsOverlay}>
          {user && (
            <div className={styles.topActions}>
              <button
                onClick={toggleFavorite}
                className={clsx(
                  styles.actionButton,
                  isFavorite && styles.favoriteActive
                )}
                title="Add to Favorites"
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button
                onClick={handleLike}
                className={clsx(
                  styles.actionButton,
                  isLiked && styles.likeActive
                )}
                title="Like"
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>
            </div>
          )}

          <div className={styles.bottomActions}>
            <span className={styles.price}>₹{photo.price}</span>

            {user && (
              <div className={styles.actionButtons}>
                {isPurchased > 0 && (
                  <button
                    onClick={() => setShowViewer(true)}
                    className={clsx(styles.actionButton, styles.viewButton)}
                    title="View Image"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                )}
                {isPurchased <= 0 && (
                  <button
                    onClick={handlePurchase}
                    className={clsx(styles.actionButton, styles.purchaseButton)}
                    title="Purchase"
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? (
                      <span className={styles.purchaseSpinner}></span>
                    ) : (
                      <FontAwesomeIcon icon={faShoppingCart} />
                    )}
                  </button>
                )}

                {isPurchased > 0 && (
                  <button
                    onClick={handleDownload}
                    className={clsx(styles.actionButton, styles.downloadButton)}
                    title="Download"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                )}
                {isPurchased > 0 && (
                  <div className={styles.shareContainer}>
                    <button
                      onClick={handleShare}
                      className={clsx(styles.actionButton, styles.shareButton)}
                      title="Share"
                    >
                      <FontAwesomeIcon icon={faShareAlt} />
                    </button>
                    {showShareOptions && (
                      <div className={styles.shareOptions} ref={shareRef}>
                        <button onClick={() => shareOnPlatform("facebook")}>
                          Facebook
                        </button>
                        <button onClick={() => shareOnPlatform("twitter")}>
                          Twitter
                        </button>
                        <button onClick={() => shareOnPlatform("whatsapp")}>
                          WhatsApp
                        </button>
                        <button onClick={() => shareOnPlatform("linkedin")}>
                          LinkedIn
                        </button>
                        <button onClick={() => shareOnPlatform("copy")}>
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{photo.title}</h3>
        <p className={styles.photographer}>{photo.photographer}</p>

        <div className={styles.meta}>
          <span className={styles.event}>{photo.event}</span>

          <div className={styles.ratingContainer}>
            <div className={styles.stars} onClick={handleRatingClick}>
              {renderStars(averageRating)}
              <span
                className={styles.ratingText}
                style={{ color: getRatingColor(averageRating) }}
              >
                ({averageRating?.toFixed(1) || "0.0"})
              </span>
            </div>
          </div>
        </div>

        <div className={styles.likesContainer}>
          <span className={styles.likesCount}>{likes} likes</span>

          {likes > 0 && (
            <div className={styles.likedUsers}>
              {likedUsers.slice(0, 3).map((user, index) => (
                <img
                  key={user?.user_id?.id}
                  src={user?.user_id?.profile || defaultProfile}
                  alt={user?.user_id?.name}
                  className={styles.userAvatar}
                  style={{ zIndex: 3 - index, left: `${index * 16}px` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showViewer && (
        <div className={styles.imageViewerOverlay}>
          <div className={styles.imageViewer}>
            <div className={styles.viewerHeader}>
              <h3 style={{ color: "#000" }}>{photo.title}</h3>
              <button
                onClick={() => setShowViewer(false)}
                className={styles.closeViewer}
              >
                ×
              </button>
            </div>

            <div className={styles.viewerImageContainer}>
              <img
                src={photo.originalimageUrl}
                alt={photo.title}
                className={styles.viewerImage}
              />
            </div>

            <div className={styles.viewerFooter}>
              <div className={styles.viewerInfo}>
                <p className={styles.viewerPhotographer}>
                  By {photo.photographer}
                </p>
                <p className={styles.viewerEvent}>Event: {photo.event}</p>
                <p className={styles.viewerPrice}>Price: ₹{photo.price}</p>
              </div>

              <div className={styles.viewerActions}>
                <button
                  onClick={handleDownload}
                  className={styles.viewerDownloadButton}
                >
                  <FontAwesomeIcon icon={faDownload} /> Download
                </button>
                {/* <button
                  onClick={handlePurchase}
                  className={styles.viewerPurchaseButton}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Purchase
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRatingModal && (
        <RatingModal
          currentRating={userRating}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          myrate={myrate}
        />
      )}
    </div>
  );
};

export default PhotoCard;
