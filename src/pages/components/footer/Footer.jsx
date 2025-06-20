import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInstagram, 
  faTwitter, 
  faFacebook, 
  faPinterest 
} from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';
import WhitLogo from '../../../assets/whitelogo-work-foto.png'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <div className={styles.logoContainer}>
               <img src={WhitLogo}/>
            </div>
            <p className={styles.description}>
              The best marketplace for photographers to sell their work and for buyers to find unique images.
            </p>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Quick Links</h3>
            <ul className={styles.list}>
              <li><a href="/" className={styles.link}>Home</a></li>
              <li><a href="/explore" className={styles.link}>Explore</a></li>
              <li><a href="/popular" className={styles.link}>Popular</a></li>
              <li><a href="/new-arrivals" className={styles.link}>New Arrivals</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Connect With Us</h3>
            <div className={styles.socialLinks}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FontAwesomeIcon icon={faPinterest} />
              </a>
            </div>
            <p className={styles.newsletterText}>Subscribe to our newsletter</p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email"
                className={styles.newsletterInput}
              />
              <button className={styles.newsletterButton}>
                Join
              </button>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} PhotoMarket. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <a href="/privacy-policy" className={styles.legalLink}>Privacy Policy</a>
            <a href="/terms-of-service" className={styles.legalLink}>Terms of Service</a>
            <a href="/contact" className={styles.legalLink}>Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;