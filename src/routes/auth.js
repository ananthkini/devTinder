const express = require("express");
const { sanitizeUserData } = require("../utils/sanitize");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const { getUserAuth } = require("../middlerware/auth");
const authRoute = express.Router();

// Signup API
authRoute.post("/signup", async (req, res) => {
  const newUser = req.body;

  

  try {
    const clearData = sanitizeUserData(req);

    const { firstName, lastName, gender, emailId, password, skills,age,photoUrl,about } = req.body;

    const hashedPwd = await bcrypt.hash(password, 10);

    const ALLOWED_COLUMN = [
      "id",
      "firstName",
      "lastName",
      "emailId",
      "password",
      "gender",
      "skills",
      "about",
      "photoUrl",
      "age",
    ];
    const isInsertAllowed = Object.keys(newUser).every((key) =>
      ALLOWED_COLUMN.includes(key)
    );

    if (!isInsertAllowed) throw new Error(" : Invalid column");

    if (newUser.skills.length > 10) throw new Error(" : Too many skills");
    

    const user = new User({
      firstName,
      lastName,
      gender,
      emailId,
      skills,
      age,
      photoUrl,
      about,
      password: hashedPwd,
    });


    await user.save();
    res.status(200).send("User added succesfully");
  } catch (err) {
    res.status(400).send("User could not be added " + err.message);
  }
});

// login API
authRoute.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!emailId || !password) throw new Error(" : Credentials required");
    isEmailValid = validator.isEmail(emailId);

    if (!isEmailValid) {
      throw new Error(" : Invalid Email");
    }
    const validUser = await User.findOne({ emailId });

    if (!validUser) {
      throw new Error(" : Invalid credentials");
    }

    const isValidPwd = await validUser.validatePassword(password);

    if (isValidPwd) {
      const token = await validUser.getJWT();
      res.cookie("token", token);
      res.status(200).send(validUser);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRoute.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  }).status(200).send('Logged out')
});

module.exports = authRoute;
