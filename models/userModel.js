const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
// initializing user schema

const URLvalidator = {
  validator: (value) => {
    // Check if value is empty then return true.
    if (value === '') {
      return true;
    }

    return validator.isURL(value, { require_protocol: true });
  },
  message: 'Pls enter a valid URL',
};
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide your name'],
    maxLength: [25, "name can't be greater than 25 words"],
    minLength: [3, "name can't be smaller than 3 words"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'please provide your email '],
    unique: true,
    validate: [validator.isEmail, 'please provide an valid email'],
  },
  photo: {
    type: String,
    default:
      'https://res.cloudinary.com/grapecluster/image/upload/v1620383267/default.jpg',
  },
  password: {
    type: String,
    required: [true, 'please provide a password '],
    minLength: [8, 'password must be greater than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please provide an password confirmed'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords dont match',
    },
  },
  bio: {
    type: String,
    default: 'No bio',
    maxLength: [300, "bio can't be greater than 300 words"],
  },
  reputation: {
    type: Number,
    default: 0,
  },
  workStatus: {
    type: String,
    maxLength: [50, "work can't be greater than 50 words"],
    default: 'No work status given',
  },
  company: {
    type: String,
    default: 'No company given',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  active: {
    type: String,
  },
  links: {
    github: {
      type: String,
      default: '',
      validate: URLvalidator,
    },
    website: {
      type: String,
      default: '',
      validate: URLvalidator,
    },
    instagram: {
      type: String,
      default: '',
      validate: URLvalidator,
    },
    facebook: {
      type: String,
      default: '',
      validate: URLvalidator,
    },
    twitter: {
      type: String,
      default: '',
      validate: URLvalidator,
    },
  },
  location: {
    type: String,
    maxLength: [70, "location can't be greater than 70 words"],
    default: 'no location given',
  },

  joinedAt: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
});

userSchema.pre('save', async function (next) {
  // populating joinedAt as the current date if the created user is new
  if (this.isNew) this.joinedAt = Date.now();

  // checking if the password was modified or updated
  // if password was not modified , break out of this function and save the user
  // else continue

  if (!this.isModified('password')) return next();

  // hashing users Password
  this.password = await bcrypt.hash(this.password, 12);

  // making passwordConfirm undefined so that it doesn't get revealed
  this.passwordConfirm = undefined;

  this.photo = `https://ui-avatars.com/api/?name=${this.name}`;
  return next();
});

// this instance method checks if two passwords match
userSchema.methods.comparePassword = async function (candidatePass, userPass) {
  const result = await bcrypt.compare(candidatePass, userPass);
  return result;
};

// this instance methods checks if password was changed recently compared to the jwt timestamp
userSchema.methods.checkIfPasswordChanged = function (JWTstamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // return true if password was channged after issueing jwt | else return false
    return JWTstamp < changedTimeStamp;
  }
  return false;
};

// initializing and exporting User model
const User = mongoose.model('User', userSchema);

module.exports = User;
