import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ hideMenuItems = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImageURL, setProfileImageURL] = useState("");
  const [showDefaultProfileIcon, setShowDefaultProfileIcon] = useState(false);
  const navigate = useNavigate();
  const { uniqueId } = useParams();

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const storedProfileImage = localStorage.getItem("userProfileImage");
    if (storedProfileImage) {
      setProfileImageURL(storedProfileImage);
      setShowDefaultProfileIcon(false);
    } else {
      setShowDefaultProfileIcon(true);
    }

    const handleStorageChange = () => {
      const updatedProfileImage = localStorage.getItem("userProfileImage");
      if (updatedProfileImage) {
        setProfileImageURL(updatedProfileImage);
        setShowDefaultProfileIcon(false);
      } else {
        setProfileImageURL("");
        setShowDefaultProfileIcon(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
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

  const getProfileImageURL = () => {
    if (profileImageURL) {
      if (profileImageURL.startsWith('http')) {
        return profileImageURL;
      }
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

      {/* Moved outside navbar-menu for persistent visibility */}
      <a href={`/dashboard/${uniqueId}`} className="navbar-home-icon">
        <img src={require("./assets/home_icon.png")} alt="Home" className="home-icon" />
        Home
      </a>

      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        {menuItems.map(({ label, href }) => (
          <a key={label} href={href}>{label}</a>
        ))}
      </div>

      <button onClick={handleProfileClick} className="navbar-profile-icon">
        {profileImageURL && !showDefaultProfileIcon ? (
          <img
            src={getProfileImageURL()}
            alt="User Profile"
            className="profile-icon profile-photo"
            onError={() => setShowDefaultProfileIcon(true)}
          />
        ) : null}

        {showDefaultProfileIcon || !profileImageURL ? (
          <img
            src={require("./assets/user_profile_icon.png")}
            alt="User Profile"
            className="profile-icon profile-default"
          />
        ) : null}
      </button>

      <div className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={handleMenuToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;