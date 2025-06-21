// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const {
//   registerUser,
//   signInUser,
//   getUserProfile,
//   updateUserProfile,
// } = require("../controllers/userController");
// const User = require("../models/userModel"); // Make sure this path matches your model file

// const router = express.Router();

// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, '..', 'uploads', 'profiles');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log('📁 Created profiles upload directory:', uploadsDir);
// }

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     try {
//       // Create unique filename: uniqueId_timestamp.extension
//       const uniqueId = req.params.uniqueId || 'unknown';
//       const timestamp = Date.now();
//       const extension = path.extname(file.originalname).toLowerCase();
//       const filename = `${uniqueId}_${timestamp}${extension}`;
//       cb(null, filename);
//     } catch (error) {
//       cb(error, null);
//     }
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//     files: 1 // Only allow 1 file
//   },
//   fileFilter: (req, file, cb) => {
//     // Check if file is an image
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
//     }
//   }
// });

// // Serve static files from uploads directory
// router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// // ============ AUTHENTICATION ROUTES ============

// // Register route
// router.post("/signup", registerUser);

// // Sign in route  
// router.post("/signin", signInUser);

// // Sign out route (optional)
// router.post("/signout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Session destroy error:', err);
//       return res.status(500).json({ message: "Sign out failed" });
//     }
    
//     res.clearCookie('connect.sid');
//     res.status(200).json({ message: "Signed out successfully" });
//   });
// });

// // ============ PROFILE ROUTES (Enhanced with File Upload) ============

// // GET profile route - Enhanced version
// router.get("/profile/:uniqueId", async (req, res) => {
//   try {
//     const { uniqueId } = req.params;
    
//     // Validate uniqueId
//     if (!uniqueId || uniqueId.trim() === '') {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const user = await User.findOne({ uniqueId }).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
    
//     // Fix profile image URL to be absolute
//     if (user.profileImage && !user.profileImage.startsWith('http')) {
//       const baseUrl = `${req.protocol}://${req.get('host')}`;
//       user.profileImage = `${baseUrl}/uploads/profiles/${path.basename(user.profileImage)}`;
//     }
    
//     console.log(`✅ Profile fetched for user: ${uniqueId}`);
//     res.json(user);
    
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     res.status(500).json({ 
//       message: "Failed to fetch user profile",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // PUT profile route with image upload - Enhanced version
// router.put("/profile/:uniqueId", upload.single('profileImage'), async (req, res) => {
//   try {
//     const { uniqueId } = req.params;
//     const { name, mobile, emergencyMobile, password, newPassword } = req.body;
    
//     // Validate uniqueId
//     if (!uniqueId || uniqueId.trim() === '') {
//       return res.status(400).json({ message: "User ID is required" });
//     }
    
//     // Find the user
//     const user = await User.findOne({ uniqueId });
//     if (!user) {
//       // Clean up uploaded file if user not found
//       if (req.file && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(404).json({ message: "User not found" });
//     }
    
//     // Update basic fields (only if provided)
//     if (name && name.trim() !== '') user.name = name.trim();
//     if (mobile && mobile.trim() !== '') user.mobile = mobile.trim();
//     if (emergencyMobile && emergencyMobile.trim() !== '') user.emergencyMobile = emergencyMobile.trim();
    
//     // Handle password change
//     if (password && newPassword) {
//       const bcrypt = require('bcrypt');
      
//       // Verify current password
//       const isCurrentPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isCurrentPasswordValid) {
//         // Clean up uploaded file if password verification fails
//         if (req.file && fs.existsSync(req.file.path)) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res.status(400).json({ message: "Current password is incorrect" });
//       }
      
//       // Validate new password
//       if (newPassword.length < 6) {
//         if (req.file && fs.existsSync(req.file.path)) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res.status(400).json({ message: "New password must be at least 6 characters" });
//       }
      
//       // Hash and update password
//       user.password = await bcrypt.hash(newPassword, 12);
//     }
    
//     // Handle image upload
//     if (req.file) {
//       try {
//         // Delete old image file if it exists
//         if (user.profileImage) {
//           const oldImagePath = path.join(uploadsDir, path.basename(user.profileImage));
//           if (fs.existsSync(oldImagePath)) {
//             fs.unlinkSync(oldImagePath);
//             console.log('🗑️ Deleted old profile image:', oldImagePath);
//           }
//         }
        
//         // Set new image URL
//         const baseUrl = `${req.protocol}://${req.get('host')}`;
//         user.profileImage = `${baseUrl}/uploads/profiles/${req.file.filename}`;
//         console.log('📸 New profile image set:', user.profileImage);
        
//       } catch (fileError) {
//         console.error('Error handling file upload:', fileError);
//         // Clean up the uploaded file
//         if (fs.existsSync(req.file.path)) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res.status(500).json({ message: "Failed to process image upload" });
//       }
//     }
    
//     // Save updated user
//     await user.save();
    
//     // Return updated user without password
//     const updatedUser = await User.findOne({ uniqueId }).select('-password');
    
//     // Fix profile image URL for response
//     if (updatedUser.profileImage && !updatedUser.profileImage.startsWith('http')) {
//       const baseUrl = `${req.protocol}://${req.get('host')}`;
//       updatedUser.profileImage = `${baseUrl}/uploads/profiles/${path.basename(updatedUser.profileImage)}`;
//     }
    
//     console.log(`✅ Profile updated for user: ${uniqueId}`);
//     res.json({
//       message: "Profile updated successfully",
//       user: updatedUser
//     });
    
//   } catch (error) {
//     console.error("Error updating user profile:", error);
    
//     // Clean up uploaded file if there was an error
//     if (req.file && fs.existsSync(req.file.path)) {
//       try {
//         fs.unlinkSync(req.file.path);
//         console.log('🗑️ Cleaned up uploaded file after error');
//       } catch (cleanupError) {
//         console.error('Error cleaning up file:', cleanupError);
//       }
//     }
    
//     // Handle specific errors
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       return res.status(409).json({ message: `${field} already exists` });
//     }
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(e => e.message);
//       return res.status(400).json({ message: "Validation failed", errors });
//     }
    
//     res.status(500).json({ 
//       message: "Failed to update profile",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ============ UTILITY ROUTES ============

// // Test route
// router.get("/test", (req, res) => {
//   res.json({ 
//     message: "User routes working!", 
//     timestamp: new Date().toISOString(),
//     uploadsDir: uploadsDir,
//     session: req.session.userId ? { userId: req.session.userId } : null
//   });
// });

// // Get all users (for admin/testing - remove in production)
// router.get("/all", async (req, res) => {
//   try {
//     // Only allow in development
//     if (process.env.NODE_ENV === 'production') {
//       return res.status(403).json({ message: "Not allowed in production" });
//     }
    
//     const users = await User.find({}).select('-password').limit(10);
//     res.json({ users, count: users.length });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Delete profile image
// router.delete("/profile/:uniqueId/image", async (req, res) => {
//   try {
//     const { uniqueId } = req.params;
    
//     const user = await User.findOne({ uniqueId });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
    
//     // Delete image file if it exists
//     if (user.profileImage) {
//       const imagePath = path.join(uploadsDir, path.basename(user.profileImage));
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//         console.log('🗑️ Deleted profile image:', imagePath);
//       }
      
//       // Remove image URL from user
//       user.profileImage = "";
//       await user.save();
//     }
    
//     res.json({ message: "Profile image deleted successfully" });
    
//   } catch (error) {
//     console.error("Error deleting profile image:", error);
//     res.status(500).json({ message: "Failed to delete profile image" });
//   }
// });

// // Error handling middleware for multer
// router.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
//     }
//     if (error.code === 'LIMIT_FILE_COUNT') {
//       return res.status(400).json({ message: "Too many files. Only 1 file allowed." });
//     }
//     if (error.code === 'LIMIT_UNEXPECTED_FILE') {
//       return res.status(400).json({ message: "Unexpected field name. Use 'profileImage'." });
//     }
//   }
  
//   if (error.message === 'Only image files (JPEG, PNG, GIF, WebP) are allowed!') {
//     return res.status(400).json({ message: error.message });
//   }
  
//   next(error);
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const {
  registerUser,
  signInUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const User = require("../models/userModel");

const router = express.Router();

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

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
    files: 1
  },
  fileFilter: (req, file, cb) => {
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

// ============ HELPER FUNCTIONS ============

// Generate unique ID
const generateUniqueId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP (mock function - replace with actual SMS service)
const sendOTP = async (mobile, otp) => {
  // Replace this with actual SMS service like Twilio, AWS SNS, etc.
  console.log(`📱 Sending OTP ${otp} to ${mobile}`);
  // For development, just log the OTP
  return Promise.resolve(true);
};

// ============ AUTHENTICATION ROUTES ============

// Regular signup route
router.post("/signup", registerUser);

// Regular signin route  
router.post("/signin", signInUser);

// Google Authentication Route
router.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });

    if (user) {
      // Update existing user
      user.lastLogin = new Date();
      user.loginCount += 1;
      
      // If user exists but doesn't have Google auth, update it
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        user.googleId = googleId;
      }
      
      await user.save();
    } else {
      // Create new user
      const uniqueId = generateUniqueId();
      
      user = new User({
        name: name,
        email: email,
        googleId: googleId,
        uniqueId: uniqueId,
        authProvider: 'google',
        isVerified: true,
        profileImage: picture || '',
        lastLogin: new Date(),
        loginCount: 1
      });
      
      await user.save();
    }

    // Return user data
    const safeUser = user.toSafeObject();
    
    res.status(200).json({
      message: "Google authentication successful",
      user: safeUser
    });

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ 
      message: "Google authentication failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Send OTP for phone authentication
router.post("/auth/phone/send-otp", async (req, res) => {
  try {
    const { mobile, name } = req.body;
    
    if (!mobile || !name) {
      return res.status(400).json({ message: "Mobile number and name are required" });
    }

    // Validate mobile number (basic validation)
    if (mobile.length < 10) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in memory (use Redis in production)
    otpStore.set(mobile, {
      otp: otp,
      name: name.trim(),
      expiry: otpExpiry,
      attempts: 0
    });

    // Send OTP via SMS (implement your SMS service here)
    await sendOTP(mobile, otp);

    console.log(`📱 OTP ${otp} sent to ${mobile} for user ${name}`);

    res.status(200).json({
      message: "OTP sent successfully",
      mobile: mobile
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ 
      message: "Failed to send OTP",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify OTP and create/login user
router.post("/auth/phone/verify-otp", async (req, res) => {
  try {
    const { mobile, otp, name, emergencyMobile } = req.body;
    
    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    // Get stored OTP data
    const storedData = otpStore.get(mobile);
    
    if (!storedData) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new OTP." });
    }

    // Check if OTP is expired
    if (new Date() > storedData.expiry) {
      otpStore.delete(mobile);
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(mobile);
      return res.status(400).json({ message: "Too many failed attempts. Please request a new OTP." });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStore.set(mobile, storedData);
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // OTP is valid, clear it from store
    otpStore.delete(mobile);

    // Check if user already exists
    let user = await User.findOne({ mobile: mobile });

    if (user) {
      // Update existing user
      user.lastLogin = new Date();
      user.loginCount += 1;
      user.isVerified = true;
      
      if (name && name.trim()) {
        user.name = name.trim();
      }
      
      if (emergencyMobile && emergencyMobile.trim()) {
        user.emergencyMobile = emergencyMobile.trim();
      }
      
      await user.save();
    } else {
      // Create new user
      const uniqueId = generateUniqueId();
      
      user = new User({
        name: name ? name.trim() : storedData.name,
        mobile: mobile,
        emergencyMobile: emergencyMobile || '',
        uniqueId: uniqueId,
        authProvider: 'phone',
        isVerified: true,
        lastLogin: new Date(),
        loginCount: 1
      });
      
      await user.save();
    }

    // Return user data
    const safeUser = user.toSafeObject();
    
    console.log(`✅ Phone authentication successful for ${mobile}`);
    
    res.status(200).json({
      message: "Phone verification successful",
      user: safeUser
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ 
      message: "OTP verification failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Sign out route
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

// ============ PROFILE ROUTES ============

// GET profile route
router.get("/profile/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;
    
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

// PUT profile route with image upload
router.put("/profile/:uniqueId", upload.single('profileImage'), async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { name, mobile, emergencyMobile, password, newPassword } = req.body;
    
    if (!uniqueId || uniqueId.trim() === '') {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const user = await User.findOne({ uniqueId });
    if (!user) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update basic fields (only if provided)
    if (name && name.trim() !== '') user.name = name.trim();
    if (mobile && mobile.trim() !== '') user.mobile = mobile.trim();
    if (emergencyMobile && emergencyMobile.trim() !== '') user.emergencyMobile = emergencyMobile.trim();
    
    // Handle password change (only for email auth users)
    if (password && newPassword && user.authProvider === 'email') {
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(password, user.password);
      if (!isCurrentPasswordValid) {
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
    
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Cleaned up uploaded file after error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
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
    
    if (user.profileImage) {
      const imagePath = path.join(uploadsDir, path.basename(user.profileImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Deleted profile image:', imagePath);
      }
      
      user.profileImage = "";
      await user.save();
    }
    
    res.json({ message: "Profile image deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ message: "Failed to delete profile image" });
  }
});

// Clean up expired OTPs (run periodically)
setInterval(() => {
  const now = new Date();
  for (const [mobile, data] of otpStore.entries()) {
    if (now > data.expiry) {
      otpStore.delete(mobile);
      console.log(`🧹 Cleaned up expired OTP for ${mobile}`);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

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