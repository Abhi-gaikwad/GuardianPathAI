const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {
  registerUser,
  signInUser,
  getUserProfile,
  updateUserProfile,
  signOutUser,
  getAllUsers,
  deleteUserAccount
} = require("../controllers/userController");
const User = require("../models/userModel");

const router = express.Router();

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
      const uniqueId = req.params.uniqueId || crypto.randomBytes(8).toString('hex');
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
    fileSize: 5 * 1024 * 1024, // 5MB
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

// Serve static files for profile images
router.use('/uploads/profiles', express.static(path.join(__dirname, '..', 'uploads', 'profiles')));

// ============ HELPER FUNCTIONS ============

const generateUniqueId = () => {
  return crypto.randomBytes(16).toString('hex');
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (mobile, otp) => {
  // Mock SMS sending function
  console.log(`📱 Sending OTP ${otp} to ${mobile}`);
  // In production, integrate with SMS service like Twilio, AWS SNS, etc.
  // Example: await twilioClient.messages.create({
  //   body: `Your OTP is: ${otp}`,
  //   from: '+1234567890',
  //   to: mobile
  // });
  return Promise.resolve({ success: true });
};

const updateLoginTracking = async (user) => {
  user.lastLogin = new Date();
  user.loginCount += 1;
  await user.save();
};

const validateMobile = (mobile) => {
  const mobileRegex = /^[\+]?[0-9]{10,15}$/;
  return mobileRegex.test(mobile);
};

// ============ AUTHENTICATION ROUTES ============

// Email/Password Authentication
router.post("/signup", registerUser);
router.post("/signin", signInUser);
router.post("/signout", signOutUser);

// ============ PHONE OTP AUTHENTICATION ============

router.post("/auth/phone/send-otp", async (req, res) => {
  try {
    const { mobile, name } = req.body;
    
    if (!mobile || !name) {
      return res.status(400).json({ message: "Mobile number and name are required" });
    }

    if (!validateMobile(mobile)) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({ message: "Name must be between 2 and 50 characters" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP with cleanup of old entries
    const otpData = {
      otp,
      name: name.trim(),
      expiry: otpExpiry,
      attempts: 0,
      createdAt: new Date()
    };

    otpStore.set(mobile, otpData);

    // Clean up expired OTP entries (basic cleanup)
    setTimeout(() => {
      const storedData = otpStore.get(mobile);
      if (storedData && storedData.createdAt === otpData.createdAt) {
        otpStore.delete(mobile);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Send OTP
    try {
      const result = await sendOTP(mobile, otp);
      
      if (!result.success) {
        otpStore.delete(mobile);
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      res.status(200).json({
        message: "OTP sent successfully",
        mobile: mobile,
        expiresIn: 300 // 5 minutes in seconds
      });

    } catch (smsError) {
      console.error("SMS sending error:", smsError);
      otpStore.delete(mobile);
      return res.status(500).json({ message: "Failed to send OTP" });
    }

  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post("/auth/phone/verify-otp", async (req, res) => {
  try {
    const { mobile, otp, name, emergencyMobile } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    if (!validateMobile(mobile)) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    if (otp.length !== 6) {
      return res.status(400).json({ message: "OTP must be 6 digits" });
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
      return res.status(400).json({ 
        message: "Invalid OTP. Please try again.",
        attemptsLeft: 3 - storedData.attempts
      });
    }

    // Clean up OTP
    otpStore.delete(mobile);

    // Validate emergency mobile if provided
    if (emergencyMobile && emergencyMobile.trim() !== '' && !validateMobile(emergencyMobile)) {
      return res.status(400).json({ message: "Please enter a valid emergency mobile number" });
    }

    // Check if user already exists
    let user = await User.findOne({ mobile, isActive: true });
    
    if (user) {
      // Existing user login
      await updateLoginTracking(user);
      user.isVerified = true;
      
      // Update name if provided and different
      if (name && name.trim() && name.trim() !== user.name) {
        if (name.trim().length < 2 || name.trim().length > 50) {
          return res.status(400).json({ message: "Name must be between 2 and 50 characters" });
        }
        user.name = name.trim();
      }
      
      // Update emergency mobile if provided
      if (emergencyMobile !== undefined) {
        user.emergencyMobile = emergencyMobile ? emergencyMobile.trim() : '';
      }
      
      await user.save();
    } else {
      // New user registration
      const uniqueId = generateUniqueId();
      const userName = name ? name.trim() : storedData.name;
      
      if (userName.length < 2 || userName.length > 50) {
        return res.status(400).json({ message: "Name must be between 2 and 50 characters" });
      }
      
      user = new User({
        name: userName,
        mobile,
        emergencyMobile: emergencyMobile ? emergencyMobile.trim() : '',
        uniqueId,
        authProvider: 'phone',
        isVerified: true,
        lastLogin: new Date(),
        loginCount: 1
      });
      
      await user.save();
    }

    // Set session
    req.session.userId = user.uniqueId;

    res.status(200).json({
      message: user.loginCount === 1 ? "Account created and verified successfully" : "Phone verification successful",
      uniqueId: user.uniqueId,
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors 
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "An account with this mobile number already exists" 
      });
    }

    res.status(500).json({
      message: "Failed to verify OTP",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============ PROFILE ROUTES ============

// Get user profile
// router.get("/profile/:uniqueId", getUserProfile);
router.get("/profile/:uniqueId", getUserProfile);

// Update user profile (with optional profile picture)
router.patch("/profile/:uniqueId", upload.single('profilePicture'), updateUserProfile);

// Upload profile picture
router.post("/profile/:uniqueId/upload-picture", upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { uniqueId } = req.params;
    const user = await User.findOne({ uniqueId, isActive: true });
    
    if (!user) {
      // Clean up uploaded file if user not found
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldPicturePath = path.join(uploadsDir, path.basename(user.profilePicture));
      if (fs.existsSync(oldPicturePath)) {
        fs.unlinkSync(oldPicturePath);
      }
    }

    // Update user with new profile picture
    user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error("Upload profile picture error:", error);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }

    res.status(500).json({
      message: "Failed to upload profile picture",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete profile picture
router.delete("/profile/:uniqueId/picture", async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const user = await User.findOne({ uniqueId, isActive: true });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profilePicture) {
      return res.status(400).json({ message: "No profile picture to delete" });
    }

    // Delete profile picture file
    const picturePath = path.join(uploadsDir, path.basename(user.profilePicture));
    if (fs.existsSync(picturePath)) {
      fs.unlinkSync(picturePath);
    }

    // Update user record
    user.profilePicture = null;
    await user.save();

    res.status(200).json({
      message: "Profile picture deleted successfully",
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error("Delete profile picture error:", error);
    res.status(500).json({
      message: "Failed to delete profile picture",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============ ADMIN ROUTES ============

// Get all users (admin only)
router.get("/admin/users", getAllUsers);

// Delete user account (admin only)
router.delete("/admin/users/:uniqueId", deleteUserAccount);

// ============ UTILITY ROUTES ============

// Check if mobile number is available
router.post("/check-mobile", async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    if (!validateMobile(mobile)) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    const existingUser = await User.findOne({ mobile, isActive: true });
    
    res.status(200).json({
      available: !existingUser,
      message: existingUser ? "Mobile number already registered" : "Mobile number available"
    });

  } catch (error) {
    console.error("Check mobile error:", error);
    res.status(500).json({
      message: "Failed to check mobile availability",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Resend OTP
router.post("/auth/phone/resend-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    if (!validateMobile(mobile)) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    // Check if there's an existing OTP request
    const existingData = otpStore.get(mobile);
    if (existingData) {
      // Check if we need to wait before resending
      const timeSinceCreation = new Date() - existingData.createdAt;
      const waitTime = 60 * 1000; // 1 minute
      
      if (timeSinceCreation < waitTime) {
        const remainingTime = Math.ceil((waitTime - timeSinceCreation) / 1000);
        return res.status(429).json({ 
          message: `Please wait ${remainingTime} seconds before requesting a new OTP` 
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store new OTP
    const otpData = {
      otp,
      name: existingData ? existingData.name : '',
      expiry: otpExpiry,
      attempts: 0,
      createdAt: new Date()
    };

    otpStore.set(mobile, otpData);

    // Clean up expired OTP entries
    setTimeout(() => {
      const storedData = otpStore.get(mobile);
      if (storedData && storedData.createdAt === otpData.createdAt) {
        otpStore.delete(mobile);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Send OTP
    try {
      const result = await sendOTP(mobile, otp);
      
      if (!result.success) {
        otpStore.delete(mobile);
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      res.status(200).json({
        message: "OTP resent successfully",
        mobile: mobile,
        expiresIn: 300 // 5 minutes in seconds
      });

    } catch (smsError) {
      console.error("SMS sending error:", smsError);
      otpStore.delete(mobile);
      return res.status(500).json({ message: "Failed to send OTP" });
    }

  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      message: "Failed to resend OTP",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Only 1 file allowed.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  
  if (error.message === 'Only image files (JPEG, PNG, GIF, WebP) are allowed!') {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
});

module.exports = router;