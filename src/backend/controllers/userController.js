// const User = require("../models/userModel");
// const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require("uuid");

// // Register User
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, mobile, emergencyMobile } = req.body;

//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate a unique ID
//     const uniqueId = uuidv4();

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       mobile,
//       emergencyMobile,
//       uniqueId,
//     });

//     if (user) {
//       res.status(201).json({ message: "User registered successfully", uniqueId: user.uniqueId });
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Sign In User
// const signInUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     res.status(200).json({ message: "User signed in successfully", uniqueId: user.uniqueId });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Get User Profile
// const getUserProfile = async (req, res) => {
//   try {
//     const { uniqueId } = req.params;
//     const user = await User.findOne({ uniqueId }).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Update User Profile
// const updateUserProfile = async (req, res) => {
//   try {
//     const { uniqueId } = req.params;
//     const { name, mobile, emergencyMobile, password, newPassword } = req.body;

//     const user = await User.findOne({ uniqueId });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.name = name || user.name;
//     user.mobile = mobile || user.mobile;
//     user.emergencyMobile = emergencyMobile || user.emergencyMobile;

//     if (password && newPassword) {
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "Current password is incorrect" });
//       }
//       user.password = await bcrypt.hash(newPassword, 10);
//     }

//     await user.save();
//     res.status(200).json({ message: "Profile updated successfully" });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// module.exports = { registerUser, signInUser, getUserProfile, updateUserProfile };


// const User = require("../models/userModel");
// const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require("uuid");

// // Register User
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, mobile, emergencyMobile } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const uniqueId = uuidv4();

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       mobile,
//       emergencyMobile,
//       uniqueId,
//     });

//     if (user) {
//       res.status(201).json({ message: "User registered successfully", uniqueId: user.uniqueId });
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Sign In User
// const signInUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Set session
//     req.session.userId = user.uniqueId;

//     res.status(200).json({ message: "User signed in successfully", uniqueId: user.uniqueId });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Get User Profile
// const getUserProfile = async (req, res) => {
//   try {
//     const { uniqueId } = req.params;
//     const user = await User.findOne({ uniqueId }).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Update User Profile
// const updateUserProfile = async (req, res) => {
//   try {
//     const { uniqueId } = req.params;
//     const { name, mobile, emergencyMobile, password, newPassword } = req.body;

//     const user = await User.findOne({ uniqueId });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.name = name || user.name;
//     user.mobile = mobile || user.mobile;
//     user.emergencyMobile = emergencyMobile || user.emergencyMobile;

//     if (password && newPassword) {
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "Current password is incorrect" });
//       }
//       user.password = await bcrypt.hash(newPassword, 10);
//     }

//     await user.save();
//     res.status(200).json({ message: "Profile updated successfully" });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// module.exports = { registerUser, signInUser, getUserProfile, updateUserProfile };



const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const twilio = require('twilio');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
const sendOTP = async (mobile, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile
    });
    return { success: true };
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    return { success: false, error: error.message };
  }
};

// Regular Email/Password Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, emergencyMobile } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });
    if (userExists) {
      return res.status(400).json({ 
        message: userExists.email === email ? "Email already exists" : "Mobile number already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const uniqueId = uuidv4();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      emergencyMobile,
      uniqueId,
      authProvider: 'email',
      isVerified: false // Email verification can be added later
    });

    if (user) {
      // Set session
      req.session.userId = user.uniqueId;
      
      res.status(201).json({ 
        message: "User registered successfully", 
        uniqueId: user.uniqueId,
        user: {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          emergencyMobile: user.emergencyMobile,
          authProvider: user.authProvider
        }
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Google OAuth Registration/Login
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (user) {
      // User exists, log them in
      if (!user.googleId && user.authProvider !== 'google') {
        // Link Google account to existing account
        user.googleId = googleId;
        user.profileImage = user.profileImage || picture;
        await user.save();
      }
      
      // Set session
      req.session.userId = user.uniqueId;
      
      return res.status(200).json({
        message: "Google sign in successful",
        uniqueId: user.uniqueId,
        isNewUser: false,
        user: {
          name: user.name,
          email: user.email,
          mobile: user.mobile || '',
          emergencyMobile: user.emergencyMobile || '',
          profileImage: user.profileImage,
          authProvider: user.authProvider,
          isVerified: user.isVerified
        }
      });
    } else {
      // Create new user
      const uniqueId = uuidv4();
      
      user = await User.create({
        name,
        email,
        googleId,
        uniqueId,
        profileImage: picture,
        authProvider: 'google',
        isVerified: true, // Google accounts are pre-verified
        mobile: '', // Will be filled later
        emergencyMobile: '', // Will be filled later
        password: '' // No password for Google auth
      });

      // Set session
      req.session.userId = user.uniqueId;

      return res.status(201).json({
        message: "Google account created successfully",
        uniqueId: user.uniqueId,
        isNewUser: true,
        needsPhoneSetup: true,
        user: {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          emergencyMobile: user.emergencyMobile,
          profileImage: user.profileImage,
          authProvider: user.authProvider,
          isVerified: user.isVerified
        }
      });
    }
  } catch (error) {
    console.error('Google auth error:', error);
    if (error.message.includes('Token used too late')) {
      return res.status(401).json({ message: "Google token expired" });
    }
    res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
};

// Send OTP for phone verification
const sendPhoneOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length < 10) {
      return res.status(400).json({ message: "Valid mobile number is required" });
    }

    // Format mobile number (add country code if not present)
    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;

    // Check if mobile already exists
    const existingUser = await User.findOne({ mobile: formattedMobile });
    if (existingUser) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const otpResult = await sendOTP(formattedMobile, otp);

    if (!otpResult.success) {
      return res.status(500).json({ 
        message: "Failed to send OTP", 
        error: otpResult.error 
      });
    }

    // Store OTP with expiry (5 minutes)
    otpStore.set(formattedMobile, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });

    res.status(200).json({ 
      message: "OTP sent successfully",
      mobile: formattedMobile
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP and register user
const verifyPhoneOTP = async (req, res) => {
  try {
    const { mobile, otp, name, emergencyMobile } = req.body;

    if (!mobile || !otp || !name) {
      return res.status(400).json({ message: "Mobile, OTP, and name are required" });
    }

    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;
    const storedOtpData = otpStore.get(formattedMobile);

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expires) {
      otpStore.delete(formattedMobile);
      return res.status(400).json({ message: "OTP expired" });
    }

    // Check attempts
    if (storedOtpData.attempts >= 3) {
      otpStore.delete(formattedMobile);
      return res.status(400).json({ message: "Too many failed attempts" });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts++;
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified, create user
    const uniqueId = uuidv4();
    const user = await User.create({
      name,
      mobile: formattedMobile,
      emergencyMobile: emergencyMobile || '',
      uniqueId,
      authProvider: 'phone',
      isVerified: true,
      email: '', // Optional for phone auth
      password: '' // No password for phone auth
    });

    // Clean up OTP
    otpStore.delete(formattedMobile);

    // Set session
    req.session.userId = user.uniqueId;

    res.status(201).json({
      message: "Phone registration successful",
      uniqueId: user.uniqueId,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        emergencyMobile: user.emergencyMobile,
        authProvider: user.authProvider,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};

// Phone number login (send OTP)
const phoneLogin = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;

    // Check if user exists
    const user = await User.findOne({ mobile: formattedMobile });
    if (!user) {
      return res.status(404).json({ message: "User not found with this mobile number" });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const otpResult = await sendOTP(formattedMobile, otp);

    if (!otpResult.success) {
      return res.status(500).json({ 
        message: "Failed to send OTP", 
        error: otpResult.error 
      });
    }

    // Store OTP
    otpStore.set(`login_${formattedMobile}`, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      userId: user.uniqueId
    });

    res.status(200).json({ 
      message: "Login OTP sent successfully",
      mobile: formattedMobile
    });
  } catch (error) {
    console.error('Phone login error:', error);
    res.status(500).json({ message: "Failed to send login OTP", error: error.message });
  }
};

// Verify login OTP
const verifyLoginOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile and OTP are required" });
    }

    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;
    const storedOtpData = otpStore.get(`login_${formattedMobile}`);

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expires) {
      otpStore.delete(`login_${formattedMobile}`);
      return res.status(400).json({ message: "OTP expired" });
    }

    // Check attempts
    if (storedOtpData.attempts >= 3) {
      otpStore.delete(`login_${formattedMobile}`);
      return res.status(400).json({ message: "Too many failed attempts" });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts++;
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Get user
    const user = await User.findOne({ uniqueId: storedOtpData.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clean up OTP
    otpStore.delete(`login_${formattedMobile}`);

    // Set session
    req.session.userId = user.uniqueId;

    res.status(200).json({
      message: "Login successful",
      uniqueId: user.uniqueId,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        emergencyMobile: user.emergencyMobile,
        profileImage: user.profileImage,
        authProvider: user.authProvider,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({ message: "Login verification failed", error: error.message });
  }
};

// Enhanced Sign In User (supports email/password and Google)
const signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({ 
        message: "This account was created with Google. Please use Google Sign In." 
      });
    }

    // Check if user registered with phone
    if (user.authProvider === 'phone') {
      return res.status(400).json({ 
        message: "This account was created with phone number. Please use phone login." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Set session
    req.session.userId = user.uniqueId;

    res.status(200).json({ 
      message: "User signed in successfully", 
      uniqueId: user.uniqueId,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        emergencyMobile: user.emergencyMobile,
        profileImage: user.profileImage,
        authProvider: user.authProvider,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile to add missing phone numbers for Google users
const updateUserProfile = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { name, mobile, emergencyMobile, password, newPassword } = req.body;

    const user = await User.findOne({ uniqueId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    if (name && name.trim() !== '') user.name = name.trim();
    if (mobile && mobile.trim() !== '') {
      // Check if mobile is already taken by another user
      const existingUser = await User.findOne({ 
        mobile: mobile.trim(), 
        uniqueId: { $ne: uniqueId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
      user.mobile = mobile.trim();
    }
    if (emergencyMobile && emergencyMobile.trim() !== '') {
      user.emergencyMobile = emergencyMobile.trim();
    }

    // Handle password change (only for email auth users)
    if (password && newPassword && user.authProvider === 'email') {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findOne({ uniqueId }).select('-password');
    
    res.status(200).json({ 
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get User Profile (existing function - no changes needed)
const getUserProfile = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const user = await User.findOne({ uniqueId }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  registerUser, 
  signInUser, 
  getUserProfile, 
  updateUserProfile,
  googleAuth,
  sendPhoneOTP,
  verifyPhoneOTP,
  phoneLogin,
  verifyLoginOTP
};