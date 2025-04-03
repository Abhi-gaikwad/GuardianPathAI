import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const { uniqueId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    emergencyMobile: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile/${uniqueId}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uniqueId]);

  // Handle Edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/profile/${uniqueId}`, formData);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Error updating profile.");
    }
  };

  return (
    <div className="profile-container">
      <Navbar hideMenuItems={["Welcome", "Map Routes", "Safety Insights", "About", "Footer"]} />
      <div className="profile-card">
        <h2>User Profile</h2>
        <form>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} disabled />

          <label>Mobile Number:</label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} disabled={!isEditing} />

          <label>Emergency Mobile Number:</label>
          <input type="tel" name="emergencyMobile" value={formData.emergencyMobile} onChange={handleChange} disabled={!isEditing} />

          {!isEditing ? (
            <button type="button" onClick={handleEditClick}>
              Edit
            </button>
          ) : (
            <button type="button" onClick={handleUpdateProfile}>
              Update Profile
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
