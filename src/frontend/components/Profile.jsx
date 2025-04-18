// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "./Navbar";
// import axios from "axios";
// import "./profile.css";

// const Profile = () => {
//   const { uniqueId } = useParams();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     emergencyMobile: "",
//   });

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/users/profile/${uniqueId}`);
//         setFormData(response.data);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, [uniqueId]);

//   // Handle Edit button click
//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle profile update
//   const handleUpdateProfile = async () => {
//     try {
//       await axios.put(`http://localhost:5000/api/users/profile/${uniqueId}`, formData);
//       alert("Profile updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert(error.response?.data?.message || "Error updating profile.");
//     }
//   };

//   return (
//     <div className="profile-container">
//       <Navbar hideMenuItems={["Welcome", "Map Routes", "Safety Insights", "About", "Footer"]} />
//       <div className="profile-card">
//         <h2>User Profile</h2>
//         <form>
//           <label>Name:</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />

//           <label>Email:</label>
//           <input type="email" name="email" value={formData.email} disabled />

//           <label>Mobile Number:</label>
//           <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} disabled={!isEditing} />

//           <label>Emergency Mobile Number:</label>
//           <input type="tel" name="emergencyMobile" value={formData.emergencyMobile} onChange={handleChange} disabled={!isEditing} />

//           {!isEditing ? (
//             <button type="button" onClick={handleEditClick}>
//               Edit
//             </button>
//           ) : (
//             <button type="button" onClick={handleUpdateProfile}>
//               Update Profile
//             </button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;



import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const { uniqueId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    emergencyMobile: "",
    profileImage: "", // string URL from server
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageURL, setPreviewImageURL] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile/${uniqueId}`);
        setFormData(response.data);
        setPreviewImageURL(response.data.profileImage); // show existing image
      } catch (error) {
        console.error("Error fetching user data:", error);
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
    setSelectedImageFile(file);
    setPreviewImageURL(URL.createObjectURL(file)); // temporary preview
  };

  const handleUpdateProfile = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("mobile", formData.mobile);
      data.append("emergencyMobile", formData.emergencyMobile);

      if (selectedImageFile) {
        data.append("profileImage", selectedImageFile); // only send if a new file is selected
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/profile/${uniqueId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData(response.data);
      setPreviewImageURL(response.data.profileImage);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Error updating profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  return (
    <div className="profile-container">
      <Navbar hideMenuItems={["Welcome", "Map Routes", "Safety Insights", "About", "Footer"]} />

      <div className="profile-card">
        <h2>User Profile</h2>

        {/* Profile Image Section */}
        <div className="profile-image-section">
          {previewImageURL ? (
            <img
              src={previewImageURL}
              alt="Profile"
              className="profile-image-preview"
            />
          ) : (
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
