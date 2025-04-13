const express = require("express");
const {
  registerUser,
  signInUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

// User Authentication Routes
router.post("/signup", registerUser);
router.post("/signin", signInUser);

// User Profile Routes
router.get("/profile/:uniqueId", getUserProfile);
router.put("/profile/:uniqueId", updateUserProfile);
// router.put("/profile/:uniqueId", upload.single("profileImage"), updateUserProfile);

module.exports = router;
