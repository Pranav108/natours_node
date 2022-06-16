const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'A user mush have a name'],
    trim: true,
  },
  email: {
    type: 'string',
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: 'string',
  password: {
    type: 'string',
    required: [true, 'A user must have a password'],
    minlength: [8, 'Please provide a password with at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: 'string',
    required: [true, 'Please confirm your password'],
    validate: {
      //This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password is actually modified
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.varifyPassword = async function (candidatePassword) {
  // here this.password is accissible because we have selected 'password' for our current user
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
