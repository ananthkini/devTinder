const express = require("express");
const app = express();
const port = 7777;

const { connectDB } = require("./config/database");
const User = require("./models/user");
const { sanitizeUserData } = require("../utils/sanitize");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { getUserAuth } = require("./middlerware/auth");

app.use(express.json());
app.use(cookieParser());

// login API
app.post("/login", async (req, res) => {
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

    const isValidPwd = await bcrypt.compare(password, validUser.password);

    if (isValidPwd) {
      const token = await jwt.sign({ _id: validUser._id }, "devTinder@143", {
        expiresIn: "60s",
      });
      res.cookie("token", token);
      res.status(200).send("User logged in");
    } else {
      throw new Error(" : Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("User could not be logged in " + err.message);
  }
});

// Get loggedIn user profile info POST Login
app.get("/profile", getUserAuth, async (req, res) => {
  res.send(res.user);
});

// Signup API
app.post("/signup", async (req, res) => {
  const newUser = req.body;

  try {
    const clearData = sanitizeUserData(req);

    const { firstName, lastName, gender, emailId, password, skills } = req.body;

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
      password: hashedPwd,
    });

    await user.save();
    res.status(200).send("User added succesfully");
  } catch (err) {
    res.status(400).send("User could not be added " + err.message);
  }
});

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
