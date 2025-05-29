import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCamera } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/header/Header";
import PhotoCard, { handleFormats } from "../components/photo-card/PhotoCard";
import Footer from "../components/footer/Footer";
import styles from "./Favorites.module.css";
import {
  getFavourateList,
  getSinglePhoto,
  setUsers,
} from "../actions/userSlice";

const Favorites = () => {
  const dispatch = useDispatch();

  const { myfavorates, singlephoto } = useSelector((state) => state.user);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getFavourateList({ limit: 3, page: 1 })).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    const formattedPhotos = myfavorates?.map((photo) => handleFormats(photo));
    setPhotos(formattedPhotos);
  }, [myfavorates]);

  useEffect(() => {
    if (!singlephoto) return;
    const formattedPhoto = handleFormats(singlephoto);
    setPhotos((prevPhotos) =>
      prevPhotos.map((p) => (p.id === formattedPhoto.id ? formattedPhoto : p))
    );
  }, [singlephoto]);

  const handleRefresh = (photo_id) => {
    dispatch(getSinglePhoto({ photo_id: photo_id }));
  };

  return (
    <div className={styles.pageContainer}>
      <Header isHome={false} />

      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Your Favorite Photos</h1>
          <p className={styles.heroSubtitle}>
            All the photos you've loved in one place
          </p>
        </div>


        {isLoading?
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        :photos?.length > 0 ? (
          <div className={styles.photoGrid}>
            {photos?.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                handleRefresh={handleRefresh}
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIllustration}>
                <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} />
                <div className={styles.photoPlaceholder}></div>
                <div className={styles.photoPlaceholder}></div>
                <div className={styles.photoPlaceholder}></div>
              </div>

              <h2 className={styles.emptyStateTitle}>No Favorites Yet</h2>

              <p className={styles.emptyStateMessage}>
                You haven't added any photos to your favorites. Start exploring
                and heart the photos you love!
              </p>
            </div>
          )
        )}

       
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
