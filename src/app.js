const express = require("express");
const app = express();
const port = 7777;

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

app.use(express.json());
app.use(cookieParser());


app.use('/', authRoute)
app.use('/', profileAuth)
app.use('/', requestAuth)



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
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((err) => {
    console.error("Database connection could not be established");
  });
