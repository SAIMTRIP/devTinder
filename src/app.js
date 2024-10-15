const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter)


connectDB()
  .then(() => {
    console.log("database connected successfully...");
    app.listen("7777", () => {
      console.log("Server is listening on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Database can not be connected::", err);
  });
