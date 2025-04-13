// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     mobile: { type: String, required: true },
//     emergencyMobile: { type: String, required: true },
//     uniqueId: { type: String, required: true, unique: true }, // Add uniqueId field
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    emergencyMobile: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true },
    
    // 👇 Add this field to store image as URL or Base64 string
    profileImage: { type: String, default: "" }, // Optional: can also add `required: true` if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
