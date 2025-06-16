import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ hideMenuItems = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImageURL, setProfileImageURL] = useState("");
  const navigate = useNavigate();
  const { uniqueId } = useParams();

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const storedProfileImage = localStorage.getItem("userProfileImage");
    if (storedProfileImage) {
      setProfileImageURL(storedProfileImage);
    }

    // Listen for storage changes to update profile image in real-time
    const handleStorageChange = () => {
      const updatedProfileImage = localStorage.getItem("userProfileImage");
      setProfileImageURL(updatedProfileImage || "");
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the same tab
    window.addEventListener('profileImageUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileImageUpdated', handleStorageChange);
    };
  }, []);

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  
  const handleProfileClick = () => {
    if (uniqueId) navigate(`/profile/${uniqueId}`);
    else alert("User ID not found!");
  };

  // Helper function to get the correct image URL
  const getProfileImageURL = () => {
    if (profileImageURL) {
      // If it's already a full URL, return as is
      if (profileImageURL.startsWith('http')) {
        return profileImageURL;
      }
      // If it's a relative path, prepend server URL
      return `http://localhost:5000${profileImageURL.startsWith('/') ? '' : '/'}${profileImageURL}`;
    }
    return "";
  };

  const menuItems = [
    { label: "Welcome", href: "#welcome" },
    { label: "Map Routes", href: "#maproutes" },
    { label: "Safety Insights", href: "#safetyinsights" },
    { label: "About", href: "#about" },
    { label: "Footer", href: "#footer" },
  ].filter((item) => !hideMenuItems.includes(item.label));

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={require("./assets/travelsafe_logo.png")} alt="TravelSafe Logo" className="logo-image" />
      </div>
      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        <a href={`/dashboard/${uniqueId}`} className="navbar-home-icon">
          <img src={require("./assets/home_icon.png")} alt="Home" className="home-icon" />
          Home
        </a>
        {menuItems.map(({ label, href }) => (
          <a key={label} href={href}>{label}</a>
        ))}
        <button onClick={handleProfileClick} className="navbar-profile-icon">
          {profileImageURL ? (
            <img 
              src={getProfileImageURL()} 
              alt="User Profile" 
              className="profile-icon profile-photo"
              onError={(e) => {
                console.error("Error loading profile image:", getProfileImageURL());
                // Hide the uploaded image and show default icon
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          
          {/* Default profile icon - shown when no image or image fails to load */}
          <img 
            src={require("./assets/user_profile_icon.png")} 
            alt="User Profile" 
            className="profile-icon profile-default"
            style={{ display: profileImageURL ? 'none' : 'block' }}
          />
        </button>
      </div>
      <div className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={handleMenuToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;