const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: function() {
        return this.authProvider === 'email' || this.authProvider === 'google';
      },
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      required: function() {
        return this.authProvider === 'email';
      },
      minlength: 6
    },
    mobile: { 
      type: String, 
      required: function() {
        return this.authProvider === 'phone';
      },
      unique: true,
      sparse: true,
      trim: true
    },
    emergencyMobile: { 
      type: String, 
      default: "",
      trim: true
    },
    uniqueId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    profileImage: { 
      type: String, 
      default: "" 
    },
    
    // Multi-auth support fields
    authProvider: {
      type: String,
      enum: ['email', 'google', 'phone'],
      required: true,
      default: 'email'
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    
    // Tracking fields
    lastLogin: {
      type: Date,
      default: Date.now
    },
    loginCount: {
      type: Number,
      default: 0
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { 
    timestamps: true 
  }
);

// Compound indexes for better performance
userSchema.index({ email: 1, authProvider: 1 });
userSchema.index({ mobile: 1, authProvider: 1 });
userSchema.index({ googleId: 1, authProvider: 1 });
userSchema.index({ uniqueId: 1, isActive: 1 });

// Pre-save middleware
userSchema.pre('save', function(next) {
  // Validate required fields based on auth provider
  if (this.authProvider === 'email' && (!this.email || !this.password)) {
    return next(new Error('Email and password are required for email authentication'));
  }
  
  if (this.authProvider === 'google' && (!this.email || !this.googleId)) {
    return next(new Error('Email and Google ID are required for Google authentication'));
  }
  
  if (this.authProvider === 'phone' && !this.mobile) {
    return next(new Error('Mobile number is required for phone authentication'));
  }
  
  next();
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.name || this.email || this.mobile || 'User';
});

// Instance method to check if profile needs completion
userSchema.methods.needsProfileCompletion = function() {
  const requiredFields = ['name'];
  
  if (this.authProvider === 'google') {
    requiredFields.push('mobile', 'emergencyMobile');
  }
  
  if (this.authProvider === 'phone') {
    requiredFields.push('emergencyMobile');
  }
  
  return requiredFields.some(field => !this[field] || this[field].trim() === '');
};

// Instance method to get safe user data
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.googleId;
  delete userObject.__v;
  return userObject;
};

// Instance method to remove sensitive data from JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Static method to find user by any identifier
userSchema.statics.findByIdentifier = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier },
      { mobile: identifier },
      { uniqueId: identifier }
    ],
    isActive: true
  });
};

// Static method to find user by uniqueId
userSchema.statics.findByUniqueId = function(uniqueId) {
  return this.findOne({ uniqueId, isActive: true });
};

module.exports = mongoose.model("User", userSchema);