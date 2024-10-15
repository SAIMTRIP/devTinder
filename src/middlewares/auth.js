const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is invalid");
    }
    const decodedToken = jwt.verify(token, "Dev@Tinder$2910");
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User is not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
