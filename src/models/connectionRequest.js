const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `{VALUE} is not correct type of status`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
    throw new Error("You can't send request to yourself");
  }
  next();
});

connectionRequestSchema.index({toUserId: 1, fromUserId: 1});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = { ConnectionRequest };
