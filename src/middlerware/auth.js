const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Validate if the user is logged in OR not. If logged in return the user document 
const getUserAuth = async (req, res, next) => {
  const cookies = req.cookies;

  const { token } = cookies;
  try {
    if (!token) throw new Error("Invalid token");
    const decodedToken = await jwt.verify(token, "devTinder@143");

    const user = await User.findOne({ _id: decodedToken._id });
    if (!user) throw new Error("Invalid User");
    res.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error validating user, " + err.message);
  }
};

module.exports = {
  getUserAuth,
};
