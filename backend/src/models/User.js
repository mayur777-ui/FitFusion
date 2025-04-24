const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  preferences: {
    style: {
      type: String,
      enum: ['casual', 'formal', 'business', 'sporty', 'bohemian', 'minimalist'],
      default: 'casual'
    },
    colors: [{
      type: String
    }],
    brands: [{
      type: String
    }],
    budget: {
      min: Number,
      max: Number
    }
  },
  recommendations: [{
    weather: String,
    occasion: String,
    location: String,
    outfit: {
      topwear: {
        item: String,
        brand: String,
        price: String,
        reason: String
      },
      bottomwear: {
        item: String,
        brand: String,
        price: String,
        reason: String
      },
      footwear: {
        item: String,
        brand: String,
        price: String,
        reason: String
      },
      accessories: [{
        item: String,
        brand: String,
        price: String,
        reason: String
      }]
    },
    style_notes: {
      overall_theme: String,
      color_palette: [String],
      fabric_suggestions: [String],
      layering_tips: String
    },
    shopping_links: {
      topwear: String,
      bottomwear: String,
      footwear: String,
      accessories: [String]
    },
    total_estimated_cost: String,
    weather_considerations: String,
    occasion_suitability: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 