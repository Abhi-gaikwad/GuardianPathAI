import React, { useState, useEffect } from 'react';
import './Footer.css';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaArrowUp,
  FaYoutube,
  FaTelegram
} from 'react-icons/fa';
import icon from './assets/travelsafe_logo.png';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [clickedSocial, setClickedSocial] = useState('');

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Newsletter subscription:', email);
      alert('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };

  // Handle social media clicks
  const handleSocialClick = (platform, e) => {
    e.preventDefault();
    
    // Add visual feedback
    setClickedSocial(platform);
    
    // Show a brief message
    const messages = {
      facebook: 'Stay tuned! Facebook page launching shortly.! 📘',
      twitter: 'We’ll be tweeting soon! 🐦',
      instagram: 'We’ll be on the gram soon! 📸',
      linkedin: 'Our professional page goes live soon! 💼'
      // youtube: 'Subscribing to our YouTube! 🎥',
      // telegram: 'Joining our Telegram! 💬'
    };
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 9999;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    notification.textContent = messages[platform];
    document.body.appendChild(notification);
    
    // Remove notification and refresh after 2 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
        // Refresh the page smoothly
        // window.location.reload();
      }, 300);
    }, 2000);
    
    // Reset clicked state
    setTimeout(() => {
      setClickedSocial('');
    }, 200);
  };

  // Animation observer for footer elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('footer-animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const footerElements = document.querySelectorAll('.footer-content > div');
    footerElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section" id="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Information */}
          <div className="footer-company">
            <div className="footer-logo-container">
              <img src={icon} alt="TravelSafe Logo" className="footer-logo-image" />
              <h3 className="footer-brand-name">TravelSafe</h3>
            </div>
            
            <p className="footer-description">
              Revolutionizing travel safety with cutting-edge AI technology. 
              We're committed to making every journey safer, smarter, and more efficient 
              for travelers worldwide.
            </p>
            
            <div className="footer-features">
              <div className="footer-feature">AI-Powered Route Optimization</div>
              <div className="footer-feature">Real-time Safety Analytics</div>
              <div className="footer-feature">24/7 Travel Assistance</div>
              <div className="footer-feature">Global Coverage Network</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#welcome">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#maproutes">Route Planning</a></li>
              <li><a href="#safetyinsights">Safety Insights</a></li>
              {/* <li><a href="/help">Help Center</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li> */}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:travelsafe@gmail.com">travelsafe2004@gmail.com</a>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href="tel:+919853249090">+91 9322038017</a>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="footer-social-section">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a 
                href="#" 
                onClick={(e) => handleSocialClick('facebook', e)} 
                className={`social-link ${clickedSocial === 'facebook' ? 'clicked' : ''}`}
              >
                <FaFacebookF className="social-icon" />
                <span>Facebook</span>
              </a>
              <a 
                href="#" 
                onClick={(e) => handleSocialClick('twitter', e)} 
                className={`social-link ${clickedSocial === 'twitter' ? 'clicked' : ''}`}
              >
                <FaTwitter className="social-icon" />
                <span>Twitter</span>
              </a>
              <a 
                href="#" 
                onClick={(e) => handleSocialClick('instagram', e)} 
                className={`social-link ${clickedSocial === 'instagram' ? 'clicked' : ''}`}
              >
                <FaInstagram className="social-icon" />
                <span>Instagram</span>
              </a>
              <a 
                href="#" 
                onClick={(e) => handleSocialClick('linkedin', e)} 
                className={`social-link ${clickedSocial === 'linkedin' ? 'clicked' : ''}`}
              >
                <FaLinkedinIn className="social-icon" />
                <span>LinkedIn</span>
              </a>
              {/* <a 
                href="#" 
                onClick={(e) => handleSocialClick('youtube', e)} 
                className={`social-link ${clickedSocial === 'youtube' ? 'clicked' : ''}`}
              >
                <FaYoutube className="social-icon" />
                <span>YouTube</span>
              </a>
              <a 
                href="#" 
                onClick={(e) => handleSocialClick('telegram', e)} 
                className={`social-link ${clickedSocial === 'telegram' ? 'clicked' : ''}`}
              >
                <FaTelegram className="social-icon" />
                <span>Telegram</span>
              </a> */}
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-newsletter">
          <h3 className="newsletter-title">Stay Updated</h3>
          <p className="newsletter-description">
            Get the latest updates on new features, safety tips, and travel insights delivered to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright-text">
              &copy; {currentYear} TravelSafe. All Rights Reserved.
            </p>
           <div className="footer-bottom-links">
  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
  <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
  <a href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</a>
  <a href="#" onClick={(e) => e.preventDefault()}>Sitemap</a>
</div>

          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>

      {/* Add custom styles for clicked effect */}
      <style jsx>{`
        .social-link.clicked {
          transform: scale(0.95);
          opacity: 0.8;
          transition: all 0.1s ease;
        }
      `}</style>
    </footer>
  );
};

export default Footer;