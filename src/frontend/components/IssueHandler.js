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
        
        // If not found, try to get it from userSession
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
        
        // Check emergency mobile
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
      // Wait for user data to load if it's still loading
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

  // Function to format phone number for WhatsApp
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return null;
    
    // Convert to string and remove all non-numeric characters
    let cleaned = phoneNumber.toString().replace(/\D/g, '');
    
    // If the number starts with 0, remove it (for Indian numbers)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // If the number doesn't start with country code, add 91 (for India)
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

    // Send message to fixed emergency number
    const fixedEmergencyNumber = "919172951183";
    console.log("Sending to fixed emergency number:", fixedEmergencyNumber);
    
    try {
      window.open(`https://wa.me/${fixedEmergencyNumber}?text=${encodeURIComponent(message)}`, "_blank");
    } catch (error) {
      console.error("Error opening WhatsApp for fixed number:", error);
    }

    // Send message to user's emergency contact
    if (emergencyMobile) {
      const formattedEmergencyNumber = formatPhoneNumber(emergencyMobile);
      
      if (formattedEmergencyNumber && formattedEmergencyNumber.length >= 10) {
        console.log("Sending to user's emergency contact:", formattedEmergencyNumber);
        try {
          window.open(`https://wa.me/${formattedEmergencyNumber}?text=${encodeURIComponent(message)}`, "_blank");
          alert(`✅ Safety alert sent to:\n• Fixed emergency number: 9172951183\n• Your emergency contact: ${emergencyMobile}`);
        } catch (error) {
          console.error("Error opening WhatsApp for emergency contact:", error);
          alert("⚠️ Safety alert sent to fixed emergency number.\nCouldn't open WhatsApp for your emergency contact.");
        }
      } else {
        console.error("Invalid formatted emergency number:", formattedEmergencyNumber);
        alert("⚠️ Safety alert sent to fixed emergency number.\nYour emergency contact number format is invalid.");
      }
    } else {
      console.log("No emergency mobile number available");
      alert("⚠️ Safety alert sent to fixed emergency number.\nPlease add an emergency contact number in your profile for additional alerts.");
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-700 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 relative text-white"
        >
          {/* Close Button */}
          <button onClick={onClose} className="cancel-icon-btn">✖</button>

          {/* Header */}
          <h3 className="text-2xl font-semibold text-center">🚨 Report an Issue</h3>
          <p className="text-lg text-gray-200 text-center mb-6">
            Select an issue and help us improve safety.
          </p>

          {/* Loading indicator */}
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
            >
              <option value="" disabled>Select an issue</option>
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