const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

// Helper function to generate unique ID
const generateUniqueId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Helper function to update login tracking
const updateLoginTracking = async (user) => {
  user.lastLogin = new Date();
  user.loginCount += 1;
  await user.save();
};

// Register User (Email/Password)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, emergencyMobile } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { mobile: mobile }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "email" : "mobile";
      return res.status(400).json({ message: `User with this ${field} already exists` });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique ID
    const uniqueId = generateUniqueId();

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      mobile: mobile || '',
      emergencyMobile: emergencyMobile || '',
      uniqueId,
      authProvider: 'email',
      isVerified: false,
      loginCount: 1,
      lastLogin: new Date()
    });

    // Set session
    req.session.userId = user.uniqueId;

    res.status(201).json({ 
      message: "User registered successfully", 
      uniqueId: user.uniqueId,
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
    });
  }
};

// Sign In User (Email/Password)
const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if user registered with different auth provider
    if (user.authProvider === 'google') {
      return res.status(400).json({ 
        message: "This account was created with Google. Please use Google Sign In." 
      });
    }

    if (user.authProvider === 'phone') {
      return res.status(400).json({ 
        message: "This account was created with phone number. Please use phone login." 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update login tracking
    await updateLoginTracking(user);

    // Set session
    req.session.userId = user.uniqueId;

    res.status(200).json({ 
      message: "User signed in successfully", 
      uniqueId: user.uniqueId,
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Sign in failed'
    });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    
    if (!uniqueId || uniqueId.trim() === '') {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({ 
      uniqueId: uniqueId.trim(),
      isActive: true
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle profile image URL
    if (user.profileImage && !user.profileImage.startsWith('http')) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      user.profileImage = `${baseUrl}/uploads/profiles/${path.basename(user.profileImage)}`;
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch profile'
    });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { name, mobile, emergencyMobile, password, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ 
      uniqueId: uniqueId.trim(),
      isActive: true
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    if (name && name.trim() !== '') {
      user.name = name.trim();
    }

    if (mobile && mobile.trim() !== '') {
      // Check if mobile is already taken by another user
      const existingUser = await User.findOne({ 
        mobile: mobile.trim(), 
        uniqueId: { $ne: uniqueId },
        isActive: true
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
      
      user.mobile = mobile.trim();
    }

    if (emergencyMobile !== undefined) {
      user.emergencyMobile = emergencyMobile.trim();
    }

    // Handle password change (only for email auth users)
    if (password && newPassword && user.authProvider === 'email') {
      const isCurrentPasswordValid = await bcrypt.compare(password, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }
      
      user.password = await bcrypt.hash(newPassword, 12);
    }

    // Save user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findOne({ 
      uniqueId: uniqueId.trim(),
      isActive: true
    }).select('-password');
    
    res.status(200).json({ 
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Profile update failed'
    });
  }
};

// Sign Out User
const signOutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ message: "Sign out failed" });
    }
    
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Signed out successfully" });
  });
};

// Get All Users (Development only)
const getAllUsers = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: "Not allowed in production" });
    }

    const users = await User.find({ isActive: true })
      .select('-password')
      .limit(10)
      .sort({ createdAt: -1 });

    res.json({ 
      users, 
      count: users.length,
      message: "Users fetched successfully"
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch users'
    });
  }
};

// Delete User Account (Soft delete)
const deleteUserAccount = async (req, res) => {
  try {
    const { uniqueId } = req.params;

    const user = await User.findOne({ 
      uniqueId: uniqueId.trim(),
      isActive: true
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete - set isActive to false
    user.isActive = false;
    await user.save();

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
    });

    res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Account deletion failed'
    });
  }
};

module.exports = { 
  registerUser, 
  signInUser, 
  getUserProfile, 
  updateUserProfile,
  signOutUser,
  getAllUsers,
  deleteUserAccount
};