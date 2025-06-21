import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ hideMenuItems = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImageURL, setProfileImageURL] = useState("");
  const [showDefaultProfileIcon, setShowDefaultProfileIcon] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { uniqueId } = useParams();

  // Load theme preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (prefersDark) {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

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

  const handleThemeToggle = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    const themeValue = newTheme ? "dark" : "light";
    localStorage.setItem("theme", themeValue);
    document.documentElement.setAttribute("data-theme", themeValue);
    
    // Dispatch custom event for other components to listen to theme changes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeValue } }));
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

      {/* Home icon - moved outside navbar-menu for persistent visibility */}
      <a href={`/dashboard/${uniqueId}`} className="navbar-home-icon">
        <img src={require("./assets/home_icon.png")} alt="Home" className="home-icon" />
        Home
      </a>

      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        {menuItems.map(({ label, href }) => (
          <a key={label} href={href}>{label}</a>
        ))}
      </div>

      {/* Theme toggle button */}
      <button onClick={handleThemeToggle} className="theme-toggle-btn" title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        <div className="theme-toggle-icon">
          {darkMode ? (
            // Sun icon for light mode
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
            </svg>
          )}
        </div>
      </button>

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