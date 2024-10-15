const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

// get User Profile API
profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
  try {
    const user = req?.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Edit User Profile API
profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    const isEditAllowed = validateEditProfileData(req);
    if (!isEditAllowed) {
      throw new Error("Edit is not allowed");
    }
    if (req.body?.skills?.length > 10) {
      throw new Error("Skills are not allowed more than 10");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(loggedInUser);
    await loggedInUser.save();
    res.json({ message: "Profie edit successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Update password API --> forgot password
profileRouter.patch("/profile/password", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const { newPassword } = req.body;
    if (!newPassword) {
      throw new Error("New Password is required");
    }

    if (loggedInUser) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      loggedInUser.password = newHashedPassword;
      await loggedInUser.save();
      res.send("Password updated successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//TODO: clean up code
//UPDATE A USER profile by userId
profileRouter.patch("/user/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
    if (!userId) {
      throw new Error("Please provide User ID");
    }
    const UPDATE_ALLOWED = [
      "userId",
      "firstName",
      "lastName",
      "password",
      "age",
      "skills",
      "gender",
      "bio",
      "photoURL",
    ];
    const isUpdateAllowed = Object.keys(data).every((key) => {
      UPDATE_ALLOWED.includes(key);
    });
    if (isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills are not allowed more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not found!!!");
    } else {
      res.send("user updated successfully!");
    }
  } catch (err) {
    res.status(500).send("Something went wrong !!!" + err.message);
  }
});

//Find feed
profileRouter.get("/feed", userAuth, async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("Feed is not available !!!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Something went wrong!!!");
  }
});

// Find user by EmailId
profileRouter.get("/user", async (req, res, next) => {
  try {
    const user = await User.find({ emailId: req.body.email });
    if (user.length === 0) {
      res.status(404).send("User is not found !!!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Something is wrong !!!" + err.message);
  }
});

//delete a user
profileRouter.delete("/user", async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(404).send("User not found !!!");
    } else {
      res.send("user deleted successfully!");
    }
  } catch (err) {
    res.status(500).send("Something went wrong!!!");
  }
});

module.exports = { profileRouter };
