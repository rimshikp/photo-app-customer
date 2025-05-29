import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCamera,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "./EditProfile.module.css";
import defaultProfile from "../../assets/profile-icon.png";
import { api } from "../../utils/api";
import { getUser } from "../../pages/actions/userSlice";

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    profile: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        profile: user.profile || defaultProfile,
      });
      setPreviewImage(user.profile || defaultProfile);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("profile", formData.profile);

      await api
        .put(`/users/update/${user?._id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setSuccessMessage("Profile updated successfully!");
          setIsLoading(false);
          setTimeout(() => setSuccessMessage(""), 3000);
          dispatch(getUser());
        });
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header isHome={false} />

      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Edit Profile</h1>
          <p className={styles.heroSubtitle}>
            Update your personal information
          </p>
        </div>

        <div className={styles.profileContainer}>
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <FontAwesomeIcon
                      icon={faUser}
                      className={styles.avatarIcon}
                    />
                  </div>
                )}
                <label htmlFor="profile-upload" className={styles.uploadButton}>
                  <FontAwesomeIcon icon={faCamera} />
                  <span>Change Photo</span>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="full_name" className={styles.formLabel}>
                <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className={styles.inputIcon}
                />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                required
                disabled // Often emails shouldn't be changed
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>
                <FontAwesomeIcon icon={faPhone} className={styles.inputIcon} />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <button
              type="submit"
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;
