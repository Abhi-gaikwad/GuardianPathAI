import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./IssueHandler.css";

const IssueHandler = ({ source, destination, onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [emergencyMobile, setEmergencyMobile] = useState(null);

  // Get the user's emergency contact from backend
  useEffect(() => {
    const fetchEmergencyContact = async () => {
      try {
        const uniqueId = localStorage.getItem("uniqueId");
        console.log(uniqueId);
        const res = await axios.get(`http://localhost:5000/api/users/profile/${uniqueId}`);
        setEmergencyMobile(res.data.emergencyMobile);
      } catch (error) {
        console.error("Failed to fetch emergency contact:", error);
      }
    };

    fetchEmergencyContact();
  }, []);

  const handleSubmit = () => {
    if (!selectedIssue) {
      alert("⚠️ Please select an issue before submitting!");
      return;
    }

    if (selectedIssue === "Alert Safety") {
      sendWhatsAppAlert();
    } else {
      alert(`🚧 Issue reported: ${selectedIssue}\n\nWe will investigate and resolve it soon!`);
    }

    onClose();
  };

  const sendWhatsAppAlert = () => {
    const locationLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(source)}+to+${encodeURIComponent(destination)}`;
    const message = `🚨 *Safety Alert!* 🚨\n\nThere is a safety concern between:\n\n🔹 *Source:* ${source}\n🔹 *Destination:* ${destination}\n\n📍 Location: ${locationLink}\n\nPlease take necessary precautions!`;

    // Send message to fixed emergency number
    window.open(`https://wa.me/9172951183?text=${encodeURIComponent(message)}`, "_blank");

    // Send message to user's emergency contact (if available)
    if (emergencyMobile) {
      window.open(`https://wa.me/${emergencyMobile}?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      alert("⚠️ Couldn't fetch user's emergency contact number.");
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

          <button onClick={handleSubmit} className="custom-submit-btn">
            Report Issue
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default IssueHandler;
