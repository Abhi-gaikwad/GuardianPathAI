const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  registerUser,
  signInUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const User = require("../models/userModel"); // Make sure this path matches your model file

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created profiles upload directory:', uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    try {
      // Create unique filename: uniqueId_timestamp.extension
      const uniqueId = req.params.uniqueId || 'unknown';
      const timestamp = Date.now();
      const extension = path.extname(file.originalname).toLowerCase();
      const filename = `${uniqueId}_${timestamp}${extension}`;
      cb(null, filename);
    } catch (error) {
      cb(error, null);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
    }
  }
});

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ============ AUTHENTICATION ROUTES ============

// Register route
router.post("/signup", registerUser);

// Sign in route  
router.post("/signin", signInUser);

// Sign out route (optional)
router.post("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ message: "Sign out failed" });
    }
    
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Signed out successfully" });
  });
});

// ============ PROFILE ROUTES (Enhanced with File Upload) ============

// GET profile route - Enhanced version
router.get("/profile/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;
    
    // Validate uniqueId
    if (!uniqueId || uniqueId.trim() === '') {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({ uniqueId }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Fix profile image URL to be absolute
    if (user.profileImage && !user.profileImage.startsWith('http')) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      user.profileImage = `${baseUrl}/uploads/profiles/${path.basename(user.profileImage)}`;
    }
    
    console.log(`✅ Profile fetched for user: ${uniqueId}`);
    res.json(user);
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ 
      message: "Failed to fetch user profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT profile route with image upload - Enhanced version
router.put("/profile/:uniqueId", upload.single('profileImage'), async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { name, mobile, emergencyMobile, password, newPassword } = req.body;
    
    // Validate uniqueId
    if (!uniqueId || uniqueId.trim() === '') {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    // Find the user
    const user = await User.findOne({ uniqueId });
    if (!user) {
      // Clean up uploaded file if user not found
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update basic fields (only if provided)
    if (name && name.trim() !== '') user.name = name.trim();
    if (mobile && mobile.trim() !== '') user.mobile = mobile.trim();
    if (emergencyMobile && emergencyMobile.trim() !== '') user.emergencyMobile = emergencyMobile.trim();
    
    // Handle password change
    if (password && newPassword) {
      const bcrypt = require('bcrypt');
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(password, user.password);
      if (!isCurrentPasswordValid) {
        // Clean up uploaded file if password verification fails
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Validate new password
      if (newPassword.length < 6) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      
      // Hash and update password
      user.password = await bcrypt.hash(newPassword, 12);
    }
    
    // Handle image upload
    if (req.file) {
      try {
        // Delete old image file if it exists
        if (user.profileImage) {
          const oldImagePath = path.join(uploadsDir, path.basename(user.profileImage));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('🗑️ Deleted old profile image:', oldImagePath);
          }
        }
        
        // Set new image URL
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        user.profileImage = `${baseUrl}/uploads/profiles/${req.file.filename}`;
        console.log('📸 New profile image set:', user.profileImage);
        
      } catch (fileError) {
        console.error('Error handling file upload:', fileError);
        // Clean up the uploaded file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: "Failed to process image upload" });
      }
    }
    
    // Save updated user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findOne({ uniqueId }).select('-password');
    
    // Fix profile image URL for response
    if (updatedUser.profileImage && !updatedUser.profileImage.startsWith('http')) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      updatedUser.profileImage = `${baseUrl}/uploads/profiles/${path.basename(updatedUser.profileImage)}`;
    }
    
    console.log(`✅ Profile updated for user: ${uniqueId}`);
    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
    
  } catch (error) {
    console.error("Error updating user profile:", error);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Cleaned up uploaded file after error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    // Handle specific errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ message: `${field} already exists` });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    
    res.status(500).json({ 
      message: "Failed to update profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============ UTILITY ROUTES ============

// Test route
router.get("/test", (req, res) => {
  res.json({ 
    message: "User routes working!", 
    timestamp: new Date().toISOString(),
    uploadsDir: uploadsDir,
    session: req.session.userId ? { userId: req.session.userId } : null
  });
});

// Get all users (for admin/testing - remove in production)
router.get("/all", async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: "Not allowed in production" });
    }
    
    const users = await User.find({}).select('-password').limit(10);
    res.json({ users, count: users.length });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete profile image
router.delete("/profile/:uniqueId/image", async (req, res) => {
  try {
    const { uniqueId } = req.params;
    
    const user = await User.findOne({ uniqueId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete image file if it exists
    if (user.profileImage) {
      const imagePath = path.join(uploadsDir, path.basename(user.profileImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Deleted profile image:', imagePath);
      }
      
      // Remove image URL from user
      user.profileImage = "";
      await user.save();
    }
    
    res.json({ message: "Profile image deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ message: "Failed to delete profile image" });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: "Too many files. Only 1 file allowed." });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: "Unexpected field name. Use 'profileImage'." });
    }
  }
  
  if (error.message === 'Only image files (JPEG, PNG, GIF, WebP) are allowed!') {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
});

module.exports = router;