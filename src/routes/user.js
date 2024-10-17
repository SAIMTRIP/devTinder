const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "bio", "skills", "photoURL"];

//API to get all pending requests for Logged in user
userRouter.get("/user/requests/recieved", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const allPendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName skills bio photoURL");
    // .populate('fromUserId', ["firstName", "lastName"]);

    if (allPendingRequests.length === 0) {
      throw new Error("No request found");
    }

    res.json({
      message: "All pending requests found successfully",
      data: allPendingRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//API to get all connections
userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const allConnections = await ConnectionRequest.find({
      status: "accepted",
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    })
      .populate("fromUserId", "firstName lastName skills bio photoURL")
      .populate("toUserId", "firstName lastName skills bio photoURL");

    if (allConnections.length === 0) {
      throw new Error("No connections");
    }

    const data = allConnections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({
      message: "All connections has been fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// user Feed API
userRouter.get("/feed", userAuth, async (req, res, next) => {
  //get all profiles except
  //own profile
  //connections profile
  //ignored profiles, interested profile

  try {
    const loggedInUser = req.user;
    const page = Number(req.query.page) || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequestsForLoggedInUser = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");

    const hideUsersFromFeed = new Set();

    connectionRequestsForLoggedInUser.forEach((connection) => {
      hideUsersFromFeed.add(connection.toUserId.toString());
      hideUsersFromFeed.add(connection.fromUserId.toString());
    });

    const profiles = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, // convert Set into Array
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(profiles);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = { userRouter };
