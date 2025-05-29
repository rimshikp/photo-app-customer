import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faEdit,
  faShoppingBag,
  faHeart,
  faSignOutAlt,
  faSearch,
  faSignInAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import styles from "./Header.module.css";
import colorLogo from '../../../assets/color-logo-workfoto.png'
import { setUsers } from "../../../pages/actions/userSlice";

const Header = ({ handleSearch, searchValue, isHome = false }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(setUsers({ key: "user", value: "" }));
    localStorage.removeItem("authToken");
    setIsDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoText}>
            <img src={colorLogo} />
          </Link>
        </div>

        <div className={styles.rightSection}>
          {isHome && (
            <div className={clsx(styles.searchContainer, styles.hiddenMd)}>
              <input
                type="text"
                value={searchValue}
                placeholder="Search photos..."
                className={styles.searchInput}
                onChange={handleSearch}
              />
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            </div>
          )}

          {user ? (
            <div className={styles.profileContainer}>
              <button
                ref={profileRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={styles.profileButton}
              >
                {user.profile ? (
                  <img
                    src={user.profile}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className={styles.profileIcon}
                  />
                )}
                <span className={styles.hiddenMd}>{user.name}</span>
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className={clsx(styles.dropdownMenu, styles.animateFadeIn)}
                >
                  {/* <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className={styles.dropdownIcon}
                    />
                    My Profile
                  </Link> */}
                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      className={styles.dropdownIcon}
                    />
                    Edit Profile
                  </Link>
                  <Link
                    to="/orders"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={faShoppingBag}
                      className={styles.dropdownIcon}
                    />
                    My Orders
                  </Link>
                  <Link
                    to="/my-favorites"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={styles.dropdownIcon}
                    />
                    Favorites
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={clsx(styles.dropdownItem, styles.logoutButton)}
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className={styles.dropdownIcon}
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link
                to="/sign-in"
                className={clsx(styles.authButton, styles.signupButton)}
              >
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  className={styles.authIcon}
                />
                <span className={styles.authText}>Login</span>
              </Link>
              <Link
                to="/sign-up"
                className={clsx(styles.authButton, styles.signupButton)}
              >
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className={styles.authIcon}
                />
                <span className={styles.authText}>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
