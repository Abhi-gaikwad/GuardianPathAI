import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./IssueHandler.css";

const IssueHandler = ({ source, destination, onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [emergencyMobile, setEmergencyMobile] = useState(null);
  const [showContactChoice, setShowContactChoice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the user's emergency contact from backend
  useEffect(() => {
    const fetchEmergencyContact = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get uniqueId from localStorage
        const uniqueId = localStorage.getItem("uniqueId");
        console.log("Fetching emergency contact for uniqueId:", uniqueId);
        
        // Check if uniqueId exists
        if (!uniqueId) {
          console.error("No uniqueId found in localStorage");
          setError("User not authenticated. Please log in again.");
          setLoading(false);
          return;
        }

        // Make API call with proper error handling
        const response = await axios.get(`http://localhost:5000/user/profile/${uniqueId}`);
        
        console.log("Full API response:", response.data);
        console.log("Emergency contact fetched:", response.data.emergencyMobile);
        
        // Set emergency mobile with proper validation
        if (response.data && response.data.emergencyMobile) {
          setEmergencyMobile(response.data.emergencyMobile);
          console.log("Emergency mobile set successfully:", response.data.emergencyMobile);
        } else {
          console.warn("No emergency mobile found in response");
          setEmergencyMobile(null);
        }
        
      } catch (error) {
        console.error("Failed to fetch emergency contact:", error);
        
        // Handle specific error cases
        if (error.response) {
          // Server responded with error status
          console.error("API Error:", error.response.status, error.response.data);
          setError(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          // Request was made but no response received
          console.error("Network Error:", error.request);
          setError("Network error. Please check your connection.");
        } else {
          // Something else happened
          console.error("Unexpected Error:", error.message);
          setError(`Unexpected error: ${error.message}`);
        }
        
        setEmergencyMobile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyContact();
  }, []); // Empty dependency array to run only on mount

  const handleSubmit = () => {
    if (!selectedIssue) {
      alert("⚠️ Please select an issue before submitting!");
      return;
    }

    if (selectedIssue === "Alert Safety") {
      console.log("Safety alert selected. Emergency mobile:", emergencyMobile);
      
      if (loading) {
        alert("⏳ Still loading user data. Please wait a moment.");
        return;
      }

      if (error) {
        alert(`❌ Error loading user data: ${error}\nPlease refresh and try again.`);
        return;
      }

      if (emergencyMobile && emergencyMobile.trim() !== '') {
        console.log("Sending alert to emergency contact:", emergencyMobile);
        sendWhatsAppAlert([emergencyMobile]);
      } else {
        alert("❌ No emergency contact found! Please add an emergency contact in your profile.");
        return;
      }
    } else {
      alert(`🚧 Issue reported: ${selectedIssue}\n\nWe will investigate and resolve it soon!`);
      onClose();
    }
  };

  const sendWhatsAppAlert = (phoneNumbers) => {
    const locationLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(source)}+to+${encodeURIComponent(destination)}`;
    const message = `🚨 *Safety Alert!* 🚨\n\nThere is a safety concern between:\n\n🔹 *Source:* ${source}\n🔹 *Destination:* ${destination}\n\n📍 Location: ${locationLink}\n\nPlease take necessary precautions!`;

    console.log("Sending alerts to:", phoneNumbers);

    if (!phoneNumbers || phoneNumbers.length === 0) {
      alert("❌ No valid phone numbers to send alert to!");
      return;
    }

    // Send messages with a delay between each
    phoneNumbers.forEach((phoneNumber, index) => {
      // Clean phone number - remove any spaces, dashes, or special characters except +
      const cleanPhoneNumber = phoneNumber.toString().replace(/[^\d+]/g, '');
      
      console.log(`Preparing to send to: ${cleanPhoneNumber}`);
      
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;
        console.log(`Opening WhatsApp for ${cleanPhoneNumber}:`, whatsappUrl);
        window.open(whatsappUrl, '_blank');
      }, index * 2000); // 2 second delay between each message
    });

    // Show confirmation message
    const contactList = phoneNumbers.map(num => {
      const cleanNum = num.toString().replace(/[^\d+]/g, '');
      return `Your Emergency Contact (${cleanNum})`;
    }).join('\n• ');
    
    alert(`✅ Safety alert sent to:\n• ${contactList}`);
    onClose();
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

          {/* Enhanced Testing Info - Show emergency contact status with loading states */}
          <div className="mb-4 p-3 bg-white bg-opacity-20 rounded-lg">
            <p className="text-sm text-center">
              🧪 <strong>Testing Mode</strong>
            </p>
            <p className="text-xs text-center text-gray-200 mt-1">
              {loading ? (
                "🔄 Loading emergency contact..."
              ) : error ? (
                `❌ Error: ${error}`
              ) : emergencyMobile ? (
                `✅ Emergency Contact: ${emergencyMobile}`
              ) : (
                "❌ No Emergency Contact Found"
              )}
            </p>
            {!loading && (
              <p className="text-xs text-center text-gray-300 mt-1">
                UniqueId: {localStorage.getItem("uniqueId") || "Not found"}
              </p>
            )}
          </div>

          <div className="relative">
            <select
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              className="custom-select-dropdown"
              disabled={loading}
            >
              <option value="" disabled>
                {loading ? "Loading..." : "Select an issue"}
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
            disabled={loading}
          >
            {loading ? "Loading..." : "Report Issue"}
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default IssueHandler;