import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ hideMenuItems = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { uniqueId } = useParams();

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const handleProfileClick = () => {
    if (uniqueId) navigate(`/profile/${uniqueId}`);
    else alert("User ID not found!");
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
          <img src={require("./assets/user_profile_icon.png")} alt="User Profile" className="profile-icon" />
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
