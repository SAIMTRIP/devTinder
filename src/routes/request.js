const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

//API to send connection request
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const toUserId = req.params.userId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      const statusAllowed = ['interested', 'ignored'];

      const isStatusAllowed = statusAllowed.includes(status);

      if(!isStatusAllowed){
        throw new Error("Status value is not allowed: "+status);
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const user = await User.findById(toUserId);

      if(!user){
        return res.status(404).json({message: "User not found"});
      }

      const isConnectionRequestExist = await ConnectionRequest.findOne({$or:[{toUserId, fromUserId},{toUserId: fromUserId, fromUserId: toUserId}]});

      if(isConnectionRequestExist){
        throw new Error("Connection request already exists");
      }

      const data = await connectionRequest.save();

      res.json({ message: "Request sent successfully", data });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

// API to accept connection request
requestRouter.post('/request/review/:status/:requestId',userAuth, async(req, res, next)=>{
  try{
    // toUserId should be logged in id
    // status should be accepted or rejected
    // requestId should be in DB
    const loggedInUser = req.user;
    const {status, requestId} = req.params;
    const allowedStatus=["rejected", "accepted"];
    const isAllowedStatus = allowedStatus.includes(status);
    if(!isAllowedStatus){
      throw new Error("Status is not allowed: "+status);
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested'
    });

    if(!connectionRequest){
      return res.status(404).send("Request is not found");
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    if(!data){
      throw new Error("Error in saving data");
    }

    res.json({message: `Request is ${status} successfully`});

  }catch(err){
    res.status(400).send("Error: "+err.message);
  }
})

module.exports = { requestRouter };
