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


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     mobile: { type: String, required: true },
//     emergencyMobile: { type: String, required: true },
//     uniqueId: { type: String, required: true, unique: true },
    
//     // 👇 Add this field to store image as URL or Base64 string
//     profileImage: { type: String, default: "" }, // Optional: can also add `required: true` if needed
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: function() {
        return this.authProvider === 'email' || this.authProvider === 'google';
      },
      unique: true,
      sparse: true // Allow null/undefined values for phone auth
    },
    password: { 
      type: String, 
      required: function() {
        return this.authProvider === 'email';
      }
    },
    mobile: { 
      type: String, 
      required: function() {
        return this.authProvider === 'phone';
      },
      unique: true,
      sparse: true // Allow null/undefined values for email/google auth initially
    },
    emergencyMobile: { 
      type: String, 
      default: "" 
    },
    uniqueId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    profileImage: { 
      type: String, 
      default: "" 
    },
    
    // New fields for multi-auth support
    authProvider: {
      type: String,
      enum: ['email', 'google', 'phone'],
      required: true,
      default: 'email'
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Only for Google auth users
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    
    // Optional: Track last login and creation method
    lastLogin: {
      type: Date,
      default: Date.now
    },
    loginCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ uniqueId: 1 });

// Pre-save middleware to handle different auth providers
userSchema.pre('save', function(next) {
  // Ensure required fields based on auth provider
  if (this.authProvider === 'email' && (!this.email || !this.password)) {
    return next(new Error('Email and password are required for email authentication'));
  }
  
  if (this.authProvider === 'google' && (!this.email || !this.googleId)) {
    return next(new Error('Email and Google ID are required for Google authentication'));
  }
  
  if (this.authProvider === 'phone' && !this.mobile) {
    return next(new Error('Mobile number is required for phone authentication'));
  }
  
  // Update login count and last login
  if (this.isModified('lastLogin')) {
    this.loginCount += 1;
  }
  
  next();
});

// Virtual for full name display
userSchema.virtual('displayName').get(function() {
  return this.name || this.email || this.mobile;
});

// Method to check if user needs to complete profile
userSchema.methods.needsProfileCompletion = function() {
  const requiredFields = ['name'];
  
  // For Google users, check if they have mobile numbers
  if (this.authProvider === 'google') {
    requiredFields.push('mobile', 'emergencyMobile');
  }
  
  // For phone users, check if they have emergency contact
  if (this.authProvider === 'phone') {
    requiredFields.push('emergencyMobile');
  }
  
  return requiredFields.some(field => !this[field] || this[field].trim() === '');
};

// Method to get safe user data (without sensitive info)
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.googleId;
  delete userObject.__v;
  return userObject;
};

// Static method to find user by any identifier
userSchema.statics.findByIdentifier = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier },
      { mobile: identifier },
      { uniqueId: identifier }
    ]
  });
};

module.exports = mongoose.model("User", userSchema);