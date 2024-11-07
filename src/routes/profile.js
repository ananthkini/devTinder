const express = require("express");
const { getUserAuth } = require("../middlerware/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validatePatchRequestData } = require("../../utils/sanitize");
const validator = require("validator");
const profileAuth = express.Router();

// Get loggedIn user profile info POST Login
profileAuth.get("/profile/view", getUserAuth, async (req, res) => {
  res.send(res.user);
});

profileAuth.patch("/profile/edit", getUserAuth, async (req, res) => {
  const data = req.body;
  const cookie = req.cookies;
  const loggedInUser = res.user;

  const { token } = cookie;
  try {
    const decodedToken = jwt.verify(token, "devTinder@143");
    if (decodedToken._id) {
      if (validatePatchRequestData(data)) {
        const isUpdated = Object.keys(data).forEach(
          (key) => (loggedInUser[key] = data[key])
        );
        await loggedInUser.save();
        res.status(200).json({
          message: `${loggedInUser.firstName}, Your update was successful`,
          data: loggedInUser,
        });
      } else {
        throw new Error("Invalid Column");
      }
    } else {
      throw new Error("Invalid token");
    }
  } catch (err) {
    res.status(400).send("User could not be updated " + err.message);
  }
});

profileAuth.patch("/profile/forgotPassword", getUserAuth, async (req, res) => {
  const { currentPwd, newPwd, confirmNewPwd } = req.body;
  const loggedInUser = res.user;

  try {
    const isPwdCorrect = await loggedInUser.validatePassword(currentPwd);
    if (!isPwdCorrect) throw new Error("Invalid password");

    const isPwdStrong = validator.isStrongPassword(newPwd);
    if (!isPwdStrong) throw new Error("Passwords needs to be strong");

    if (newPwd !== confirmNewPwd) throw new Error("Password does not match");

    const hashedPwd = await bcrypt.hash(newPwd, 10);
    loggedInUser.password = hashedPwd;

    await loggedInUser.save();
    res.status(200).send("Password updated");
  } catch (err) {
    res.status(400).send("Password could not be changed : " + err.message);
  }
});

module.exports = profileAuth;
