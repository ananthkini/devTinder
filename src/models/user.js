const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
require('dotenv').config()

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(" : Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(" : Enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      required:true,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not a valid gender",
      },
    },
    about: {
      type: String,
      default: "This is a default About of the user",
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(" : Enter a valid photo url");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// get JWT Token for logIn
userSchema.methods.getJWT = async function () {
  const currentUser = this;

  const token = jwt.sign({ _id: currentUser._id }, process.env.JWT_SECRET_KEY);

  return token;
};

// Validate user entered password with the hashed password in DB
userSchema.methods.validatePassword = async function (userPassword) {
  const currentUser = this;
  const hashedPassword = this.password;

  const isPasswordValid = bcrypt.compare(userPassword, hashedPassword);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
