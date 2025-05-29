import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faSearch,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

import Header from "../components/header/Header";
import PhotoCard, { handleFormats } from "../components/photo-card/PhotoCard";
import Footer from "../components/footer/Footer";
import styles from "./Home.module.css";
import FilterButtons from "../components/FilterButtons/FilterButtons";
import { api } from "../../utils/api";
import {
  getHomeGallery,
  getSinglePhoto,
  resetGallery,
  setUsers,
} from "../actions/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { gallery, singlephoto, hasMore } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState(["all"]);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(resetGallery());

    setIsLoading(true);
    dispatch(getHomeGallery({ limit: 3, page: 1 })).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    const formattedPhotos = gallery?.map((photo) => handleFormats(photo));
    setPhotos(formattedPhotos);
  }, [gallery]);

  useEffect(() => {
    if (!singlephoto) return;
    const formattedPhoto = handleFormats(singlephoto);
    setPhotos((prevPhotos) =>
      prevPhotos.map((p) => (p.id === formattedPhoto.id ? formattedPhoto : p))
    );
  }, [singlephoto]);

  const handleScroll = useCallback(
    debounce(() => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        setIsLoading(true);
        const nextPage = page + 1;
        dispatch(
          getHomeGallery({
            limit: 3,
            page: nextPage,
            eventIds: filter.filter((item) => item !== "all"),
            search: searchValue,
          })
        ).then(() => {
          setPage(nextPage);
          setIsLoading(false);
        });
      }
    }, 200),
    [isLoading, hasMore, page, dispatch]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleRefresh = (photo_id) => {
    dispatch(getSinglePhoto({ photo_id: photo_id }));
  };

  const handleFilter = (id) => {
    setFilter((prevFilter) => {
      let newFilter;
      if (prevFilter.includes(id)) {
        newFilter = prevFilter.filter((item) => item !== id);
        if (newFilter.length === 0) {
          newFilter = ["all"];
        }
      } else {
        if (id == "all") {
          newFilter = ["all"];
        } else {
          newFilter = [...prevFilter.filter((item) => item !== "all"), id];
        }
      }
      return [...new Set(newFilter)];
    });
  };

  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    dispatch(
      getHomeGallery({
        limit: 3,
        page: 1,
        eventIds: filter.filter((item) => item !== "all"),
        search: searchValue,
      })
    ).then(() => {
      setIsLoading(false);
    });
  }, [filter, dispatch]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    dispatch(
      getHomeGallery({
        limit: 3,
        page: 1,
        eventIds: filter.filter((item) => item !== "all"),
        search: searchValue,
      })
    ).then(() => {
      setIsLoading(false);
    });
  }, [searchValue]);

  return (
    <div className={styles.pageContainer}>
      <Header
        handleSearch={handleSearch}
        searchValue={searchValue}
        isHome={true}
      />

      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Discover Amazing Photography</h1>
          <p className={styles.heroSubtitle}>
            Find and purchase high-quality images from talented photographers
          </p>
        </div>

        <FilterButtons activeFilter={filter} onFilterChange={handleFilter} />

        {photos.length > 0 ? (
          <div className={styles.photoGrid}>
            {photos.map((photo) => (
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
                <FontAwesomeIcon
                  icon={faCamera}
                  className={styles.cameraIcon}
                />
                <div className={styles.photoPlaceholder}></div>
                <div className={styles.photoPlaceholder}></div>
                <div className={styles.photoPlaceholder}></div>
              </div>

              <h2 className={styles.emptyStateTitle}>No Photos Found</h2>

              <p className={styles.emptyStateMessage}>
                {filter.includes("all")
                  ? "We couldn't find any photos in our gallery. Check back later!"
                  : "No photos match your current filters. Try adjusting your search criteria."}
              </p>
            </div>
          )
        )}

        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
