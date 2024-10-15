const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/connection/request", userAuth, (req, res, next) => {
  res.send("connect request sent");
});

module.exports = { requestRouter };
