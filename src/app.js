const express = require("express");
const app = express();
require('dotenv').config()

const cors = require('cors')
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { sanitizeUserData } = require("./utils/sanitize");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { getUserAuth } = require("./middlerware/auth");
const authRoute = require("./routes/auth");
const profileAuth = require("./routes/profile");
const requestAuth = require("./routes/request");
const userRouter = require("./routes/user");
const http = require('http');
const initializeSocket = require("./utils/socket");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true,
}));

const server = http.createServer(app)
initializeSocket(server)


app.use("/", authRoute);
app.use("/", profileAuth);
app.use("/", requestAuth);
app.use("/", userRouter);

// Find user by their emailId
app.get("/user", getUserAuth, async (req, res) => {
  const userId = req.body.emailId;

  try {
    const users = await User.find({ emailId: userId });
    if (users.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delete an user by their _id
app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(400).send("User could not be deleted");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// update a user data
app.patch("/updateUser", async (req, res) => {
  const id = req.body.userId;
  const userData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, userData);
    if (updatedUser) {
      res.status(200).send("User data updated");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// update a user data
app.put("/updateUser", async (req, res) => {
  const id = req.body.userId;
  const userData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, userData);
    if (updatedUser) {
      res.status(200).send("User data updated");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected succesfully");
    server.listen(process.env.PORT, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`)
    );
  })
  .catch((err) => {
    console.error("Database connection could not be established");
  });
