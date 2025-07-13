const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  emailAccounts: [{
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    imap_server: {
      type: String,
      required: true,
      default: 'imap.gmail.com'
    },
    imap_port: {
      type: Number,
      required: true,
      default: 993
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ''
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to add email account
userSchema.methods.addEmailAccount = function(emailAccount) {
  this.emailAccounts.push(emailAccount);
  return this.save();
};

// Method to remove email account
userSchema.methods.removeEmailAccount = function(emailId) {
  this.emailAccounts = this.emailAccounts.filter(account => 
    account._id.toString() !== emailId
  );
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 