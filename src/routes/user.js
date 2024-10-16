const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");

const userRouter = express.Router();

//API to get all pending requests for Logged in user
userRouter.get("/user/requests/recieved", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const allPendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate('fromUserId', "firstName lastName skills bio photoURL")
    // .populate('fromUserId', ["firstName", "lastName"]);

    if (allPendingRequests.length===0) {
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
userRouter.get("/user/connections", userAuth, async(req, res, next)=>{
    try{
        const loggedInUser = req.user;

        const allConnections = await ConnectionRequest.find({
            status: 'accepted',
            $or:[{
                toUserId: loggedInUser._id
            },{
                fromUserId: loggedInUser._id
            }]
        }).populate("fromUserId", "firstName lastName skills bio photoURL").populate("toUserId", "firstName lastName skills bio photoURL");

        if(allConnections.length ===0){
            throw new Error("No connections");
        }

        const data = allConnections.map((connection)=>{
            if(connection.fromUserId._id.toString() === loggedInUser._id.toString()){
                return connection.toUserId;
            }
            return connection.fromUserId;
        })

        res.json({message: "All connections has been fetched successfully", data: data});

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

module.exports = { userRouter };
