import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { SessionUtils } from "./sessionUtils"; // Import your session utilities
import "./profile.css";

const Profile = () => {
  const { uniqueId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    emergencyMobile: "",
    profileImage: "", // string URL from server
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageURL, setPreviewImageURL] = useState("");

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setDarkMode(isDark);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (prefersDark) {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Listen for theme changes from navbar
    const handleThemeChange = (event) => {
      const newTheme = event.detail.theme;
      setDarkMode(newTheme === "dark");
      document.documentElement.setAttribute("data-theme", newTheme);
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  // Check session validity on component mount
  useEffect(() => {
    if (!SessionUtils.isSessionValid()) {
      navigate("/signin", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      
      try {
        const response = await axios.get(`https://pathbuddy.onrender.com/api/users/profile/${uniqueId}`);
        // console.log("REACT_APP_API_BASE:", process.env.REACT_APP_API_BASE);
        //  const response = await axios.get(`${process.env.REACT_APP_API_BASE}/api/users/profile/${uniqueId}`);

        setFormData(response.data);
        // Set preview URL to the existing profile image
        if (response.data.profileImage) {
          setPreviewImageURL(response.data.profileImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // If unauthorized, redirect to signin
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };
    fetchUserData();
  }, [uniqueId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      // Create preview URL for the selected file
      const filePreviewURL = URL.createObjectURL(file);
      setPreviewImageURL(filePreviewURL);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("mobile", formData.mobile);
      data.append("emergencyMobile", formData.emergencyMobile);

      if (selectedImageFile) {
        data.append("profilePicture", selectedImageFile);
      }

      const response = await axios.patch(
        `https://pathbuddy.onrender.com/api/users/profile/${uniqueId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true  // ✅ This is required!
        }
      );


      // Update form data with response
      setFormData(response.data);
      
      // Handle image URL update
      if (response.data.profileImage) {
        // If server returns a new image URL, use it
        setPreviewImageURL(response.data.profileImage);
        // Store the profile image URL in localStorage for navbar access
        localStorage.setItem("userProfileImage", response.data.profileImage);
        // Dispatch custom event to notify navbar of profile image update
        window.dispatchEvent(new CustomEvent('profileImageUpdated'));
      } else if (selectedImageFile && !response.data.profileImage) {
        // If image was uploaded but server didn't return URL, keep the preview
        // This handles cases where server processes image but doesn't return URL immediately
        console.log("Image uploaded but server response doesn't include image URL");
      }
      
      // Clear the selected file after successful update
      setSelectedImageFile(null);
      
      alert("Profile updated successfully!");
      setIsEditing(false);
      
      // Force refresh the profile data to get the latest image URL
      setTimeout(async () => {
        try {
          const refreshResponse = await axios.get(`https://pathbuddy.onrender.com/api/users/profile/${uniqueId}`);
          setFormData(refreshResponse.data);
          if (refreshResponse.data.profileImage) {
            setPreviewImageURL(refreshResponse.data.profileImage);
            // Update localStorage with the latest profile image
            localStorage.setItem("userProfileImage", refreshResponse.data.profileImage);
            // Dispatch custom event to notify navbar of profile image update
            window.dispatchEvent(new CustomEvent('profileImageUpdated'));
          }
        } catch (error) {
          console.error("Error refreshing profile data:", error);
        }
      }, 1000); // Wait 1 second before refreshing
      
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Error updating profile.");
      
      // If unauthorized, redirect to signin
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    // Clear all authentication-related data using SessionUtils
    SessionUtils.clearSession();
    
    // Also clear any other auth-related localStorage items
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userProfileImage"); // Clear profile image from localStorage
    
    // Clear sessionStorage completely
    sessionStorage.clear();
    
    // Navigate to signin page and replace current history entry
    navigate("/signin", { replace: true });
  };

  // Helper function to get the correct image URL
  const getImageURL = () => {
    if (previewImageURL) {
      // If it's a blob URL (for preview), return as is
      if (previewImageURL.startsWith('blob:')) {
        return previewImageURL;
      }
      // If it's a server URL, make sure it's absolute
      if (previewImageURL.startsWith('http')) {
        return previewImageURL;
      }
      // If it's a relative path, prepend server URL
      return `https://pathbuddy.onrender.com/${previewImageURL.startsWith('/') ? '' : '/'}${previewImageURL}`;
    }
    return "";
  };

  // Store profile image URL in localStorage when component mounts or updates
  useEffect(() => {
    if (formData.profileImage) {
      localStorage.setItem("userProfileImage", formData.profileImage);
      // Dispatch custom event to notify navbar of profile image update
      window.dispatchEvent(new CustomEvent('profileImageUpdated'));
    }
  }, [formData.profileImage]);

  return (
    <div className={`profile-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Navbar hideMenuItems={["Welcome", "Map Routes", "Safety Insights", "About", "Footer"]} />

      <div className="profile-card">
        <h2>User Profile</h2>

        {/* Profile Image Section */}
        <div className="profile-image-section">
          {previewImageURL ? (
            <img
              src={getImageURL()}
              alt="Profile"
              className="profile-image-preview"
              onError={(e) => {
                console.error("Error loading image:", getImageURL());
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          
          {!previewImageURL && (
            <div className="image-placeholder">No Image</div>
          )}

          {isEditing && (
            <>
              <label htmlFor="image-upload" className="image-upload-label">
                Upload Image (Gallery/Camera)
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

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
            <button type="button" onClick={handleEditClick}>Edit</button>
          ) : (
            <button type="button" onClick={handleUpdateProfile}>Update Profile</button>
          )}
        </form>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;

