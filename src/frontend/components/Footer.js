import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // Import icons from react-icons
import icon from './assets/travelsafe_logo.png';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-logo">
          {/* Use an <img> tag to display the logo */}
          <img src={icon} alt="TravelSafe Logo" className="footer-logo-image" />
          <p>Creating safest travel experiences.</p>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: travelsafe@gmail.com</p>
          <p>Phone: +91 985 324 90</p>
        </div>
      </div>
      <div className="footer-social">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedinIn />
        </a>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 TravelSafe .  All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;