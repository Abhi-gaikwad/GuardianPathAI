const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, emergencyMobile } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique ID
    const uniqueId = uuidv4();

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      emergencyMobile,
      uniqueId,
    });

    if (user) {
      res.status(201).json({ message: "User registered successfully", uniqueId: user.uniqueId });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Sign In User
const signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "User signed in successfully", uniqueId: user.uniqueId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get User Profile
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
    res.status(500).json({ message: "Server error", error });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { name, mobile, emergencyMobile, password, newPassword } = req.body;

    const user = await User.findOne({ uniqueId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    user.emergencyMobile = emergencyMobile || user.emergencyMobile;

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { registerUser, signInUser, getUserProfile, updateUserProfile };
