const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

//Sign up API
authRouter.post("/signup", async (req, res, next) => {
  try {
    // Validate sign up req.body
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating User:" + err.message);
  }
});

//Login API
authRouter.post("/login", async (req, res, next) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      }); // cookie will expire in 7 days
      res.send("User Logged In successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Login Error: " + err.message);
  }
});

//Log out API
authRouter.post("/logout", (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User logged out");
});

module.exports = { authRouter };
