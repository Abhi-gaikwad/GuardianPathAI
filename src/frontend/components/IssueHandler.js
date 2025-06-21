import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./IssueHandler.css";

const IssueHandler = ({ source, destination, onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [emergencyMobile, setEmergencyMobile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    const locationLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(source)}+to+${encodeURIComponent(destination)}`;
    const message = `🚨 *Safety Alert!* 🚨\n\nThere is a safety concern between:\n\n🔹 *Source:* ${source}\n🔹 *Destination:* ${destination}\n\n📍 Location: ${locationLink}\n\nPlease take necessary precautions!`;

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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-700 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 relative text-white"
        >
          <button onClick={onClose} className="cancel-icon-btn">✖</button>

          <h3 className="text-2xl font-semibold text-center">🚨 Report an Issue</h3>
          <p className="text-lg text-gray-200 text-center mb-6">
            Select an issue and help us improve safety.
          </p>

          {isLoading && (
            <div className="text-center mb-4">
              <p className="text-yellow-200">⏳ Loading emergency contact...</p>
            </div>
          )}

          <div className="relative">
            <select
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              className="custom-select-dropdown"
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? "Loading..." : "Select an issue"}
              </option>
              <option value="Path Not Found">🚧 Path Not Found</option>
              <option value="Alert Safety">⚠️ Safety Alert</option>
              <option value="Incorrect Route">🔄 Incorrect Route</option>
              <option value="Traffic Issue">🚦 Traffic Issue</option>
            </select>
          </div>

          <button 
            onClick={handleSubmit} 
            className="custom-submit-btn"
            disabled={isLoading && selectedIssue === "Alert Safety"}
          >
            {isLoading && selectedIssue === "Alert Safety" ? "Loading..." : "Report Issue"}
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default IssueHandler;
