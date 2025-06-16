const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  emergencyMobile: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

// Index for better query performance
userSchema.index({ email: 1, uniqueId: 1 });

// Pre-save middleware to handle password hashing if needed
userSchema.pre('save', function(next) {
  // You can add password hashing logic here if needed
  next();
});

// Instance method to transform user object (remove sensitive data)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Static method to find user by uniqueId
userSchema.statics.findByUniqueId = function(uniqueId) {
  return this.findOne({ uniqueId, isActive: true });
};

const User = mongoose.model('User', userSchema);

module.exports = User;