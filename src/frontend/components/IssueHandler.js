import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./IssueHandler.css";

const IssueHandler = ({ destination, onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [emergencyMobile, setEmergencyMobile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // Load theme preference and listen for theme changes
  useEffect(() => {
    const loadTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      } else if (prefersDark) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    };

    loadTheme();

    // Listen for theme changes from navbar
    const handleThemeChange = (event) => {
      setDarkMode(event.detail.theme === "dark");
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  // Get live location
  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLiveLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLiveLocation(null);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      console.warn("Geolocation not supported");
      setLocationLoading(false);
    }
  }, []);

  // Get the user's emergency contact from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Try to get uniqueId from different possible localStorage keys
        let uniqueId = localStorage.getItem("uniqueId");
        let sessionData = null;

        if (!uniqueId) {
          const userSession = localStorage.getItem("userSession");
          if (userSession) {
            try {
              sessionData = JSON.parse(userSession);
              uniqueId = sessionData.uniqueId || sessionData.userId || sessionData.id;
              console.log("Found uniqueId in userSession:", uniqueId);
            } catch (error) {
              console.error("Error parsing userSession:", error);
            }
          }
        }

        if (!uniqueId) {
          console.error("No uniqueId found in localStorage or userSession");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/users/profile/${uniqueId}`);
        console.log("API Response status:", response.status);

        const emergencyContact = response.data.emergencyMobile;
        if (emergencyContact && emergencyContact.toString().trim() !== "") {
          setEmergencyMobile(emergencyContact.toString().trim());
          console.log("Emergency mobile set successfully:", emergencyContact);
        } else {
          console.log("No valid emergency mobile found");
          setEmergencyMobile(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        console.error("Error response:", error.response?.data);
        if (error.response?.status === 401) {
          console.error("Unauthorized access - user may need to login again");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedIssue) {
      alert("⚠️ Please select an issue before submitting!");
      return;
    }

    if (selectedIssue === "Alert Safety") {
      if (isLoading) {
        alert("⏳ Please wait while we load your emergency contact information...");
        return;
      }
      sendWhatsAppAlert();
    } else {
      alert(`🚧 Issue reported: ${selectedIssue}\n\nWe will investigate and resolve it soon!`);
    }

    onClose();
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return null;
    let cleaned = phoneNumber.toString().replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length === 10 && !cleaned.startsWith('91')) {
      cleaned = '91' + cleaned;
    }
    console.log("Original phone number:", phoneNumber);
    console.log("Formatted phone number:", cleaned);
    return cleaned;
  };

  const sendWhatsAppAlert = () => {
    const liveLocLink = liveLocation
      ? `https://www.google.com/maps?q=${liveLocation.lat},${liveLocation.lng}`
      : "Location unavailable";

    const liveLocationText = liveLocation
      ? `${liveLocation.lat.toFixed(6)}, ${liveLocation.lng.toFixed(6)}`
      : "Location unavailable";

    const message = `🚨 *Safety Alert!* 🚨\n\nThere is a safety concern from your current location:\n\n🔹 *Current Location:* ${liveLocationText}\n🔹 *Destination:* ${destination}\n\n📍 Live Location Link: ${liveLocLink}\n\nPlease take necessary precautions!`;

    let emergencyContactURL = null;
    let emergencyContactNumber = null;

    if (emergencyMobile) {
      emergencyContactNumber = formatPhoneNumber(emergencyMobile);
      if (emergencyContactNumber && emergencyContactNumber.length >= 10) {
        emergencyContactURL = `https://wa.me/${emergencyContactNumber}?text=${encodeURIComponent(message)}`;
      }
    }

    const openWhatsAppWithDelay = (url, delay = 0) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            window.open(url, "_blank");
            resolve(true);
          } catch (error) {
            console.error("Error opening WhatsApp:", error);
            resolve(false);
          }
        }, delay);
      });
    };

    const sendMessages = async () => {
      if (emergencyContactURL) {
        console.log("Sending to user's emergency contact:", emergencyContactNumber);
        await openWhatsAppWithDelay(emergencyContactURL, 0);
        alert(`✅ Safety alert sent to your emergency contact: ${emergencyMobile}`);
      } else {
        if (emergencyMobile) {
          console.error("Invalid formatted emergency number:", emergencyContactNumber);
          alert("⚠️ Emergency contact number format is invalid. Unable to send alert.");
        } else {
          console.log("No emergency mobile number available");
          alert("⚠️ No emergency contact found. Please update your profile with an emergency number.");
        }
      }
    };

    sendMessages();
  };

  const issueOptions = [
    { value: "Path Not Found", icon: "🚧", label: "Path Not Found" },
    { value: "Alert Safety", icon: "⚠️", label: "Safety Alert" },
    { value: "Incorrect Route", icon: "🔄", label: "Incorrect Route" },
    { value: "Traffic Issue", icon: "🚦", label: "Traffic Issue" },
  ];

  return (
    <div className={`issue-handler-overlay ${darkMode ? 'dark' : 'light'}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`issue-handler-modal ${darkMode ? 'dark' : 'light'}`}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className={`issue-handler-close-btn ${darkMode ? 'dark' : 'light'}`}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="issue-handler-header">
          <div className="issue-handler-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="issue-handler-title">Report an Issue</h2>
          <p className="issue-handler-subtitle">
            Help us improve your travel experience by reporting any issues you encounter.
          </p>
        </div>

        {/* Route Info */}
        <div className={`route-info ${darkMode ? 'dark' : 'light'}`}>
          <div className="route-item">
            <span className="route-label">Current Location:</span>
            <span className="route-value">
              {locationLoading ? (
                <span className="location-loading">Getting location...</span>
              ) : liveLocation ? (
                <span className="location-coords">
                  {liveLocation.lat.toFixed(4)}, {liveLocation.lng.toFixed(4)}
                </span>
              ) : (
                <span className="location-unavailable">Location unavailable</span>
              )}
            </span>
          </div>
          <div className="route-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="route-item">
            <span className="route-label">To:</span>
            <span className="route-value">{destination}</span>
          </div>
        </div>

        {/* Loading State */}
        {(isLoading || locationLoading) && (
          <div className={`loading-state ${darkMode ? 'dark' : 'light'}`}>
            <div className="loading-spinner"></div>
            <p>
              {isLoading && locationLoading 
                ? "Loading emergency contact and location..." 
                : isLoading 
                ? "Loading emergency contact information..." 
                : "Getting your current location..."}
            </p>
          </div>
        )}

        {/* Issue Selection */}
        <div className="issue-selection">
          <label className="issue-label">Select Issue Type:</label>
          <div className="issue-options">
            {issueOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setSelectedIssue(option.value)}
                className={`issue-option ${selectedIssue === option.value ? 'selected' : ''} ${darkMode ? 'dark' : 'light'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading && option.value === "Alert Safety"}
              >
                <span className="issue-option-icon">{option.icon}</span>
                <span className="issue-option-text">{option.label}</span>
                {selectedIssue === option.value && (
                  <motion.div
                    layoutId="selectedIndicator"
                    className="selected-indicator"
                    initial={false}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Emergency Contact Info */}
        {selectedIssue === "Alert Safety" && !isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`emergency-info ${darkMode ? 'dark' : 'light'}`}
          >
            {emergencyMobile ? (
              <div className="emergency-contact-display">
                <span className="emergency-icon">📞</span>
                <span>Emergency contact: {emergencyMobile}</span>
              </div>
            ) : (
              <div className="emergency-warning">
                <span className="warning-icon">⚠️</span>
                <span>No emergency contact found. Please update your profile.</span>
              </div>
            )}
            {!liveLocation && !locationLoading && (
              <div className="emergency-warning" style={{ marginTop: '0.5rem' }}>
                <span className="warning-icon">📍</span>
                <span>Location access denied. Safety alert will be sent without location.</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!selectedIssue || (isLoading && selectedIssue === "Alert Safety") || (locationLoading && selectedIssue === "Alert Safety")}
          className={`issue-handler-submit-btn ${darkMode ? 'dark' : 'light'} ${!selectedIssue ? 'disabled' : ''}`}
          whileHover={selectedIssue ? { scale: 1.02 } : {}}
          whileTap={selectedIssue ? { scale: 0.98 } : {}}
        >
          {((isLoading || locationLoading) && selectedIssue === "Alert Safety") ? (
            <>
              <div className="button-spinner"></div>
              Loading...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Report Issue
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default IssueHandler;