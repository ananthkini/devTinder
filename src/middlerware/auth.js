const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config()

//Validate if the user is logged in OR not. If logged in return the user document 
const getUserAuth = async (req, res, next) => {
  const cookies = req.cookies;

  const { token } = cookies;
  
  try {
    if (!token) throw new Error("Invalid token");
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await User.findOne({ _id: decodedToken._id });
    if (!user) throw new Error("Invalid User");
    res.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error validating user, " + err.message);
  }
};

module.exports = {
  getUserAuth,
};
