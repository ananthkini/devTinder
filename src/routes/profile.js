const express = require("express");
const { getUserAuth } = require("../middlerware/auth");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validatePatchRequestData } = require("../../utils/sanitize");

const profileAuth = express.Router();

// Get loggedIn user profile info POST Login
profileAuth.get("/profile/view", getUserAuth, async (req, res) => {
  res.send(res.user);
});

profileAuth.patch("/profile/edit", getUserAuth, async (req, res) => {
  const data = req.body;
  const cookie = req.cookies;
  const loggedInUser = res.user;

  console.log(loggedInUser);

  const { token } = cookie;
  try {
    const userToUpdate = await User.findById(loggedInUser._id);
    if (!userToUpdate) throw new Error("User does not exists");

    const decodedToken = jwt.verify(token, "devTinder@143");
    if (decodedToken._id) {
      if (validatePatchRequestData(data)) {
        const isUpdated = Object.keys(data).forEach(
          (key) => (loggedInUser[key] = data[key])
        );
        await loggedInUser.save();
        res
          .status(200)
          .json({
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

module.exports = profileAuth;
