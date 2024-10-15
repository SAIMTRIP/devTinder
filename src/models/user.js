const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxLength: 100,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Email ID is not correct");
        }
      },
    },
    password: {
      type: String,
      required: true,
      maxLength: 1000,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 150,
    },
    gender: {
      type: String,
      lowercase: true,
      validate: (value) => {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not correct");
        }
      },
    },
    skills: {
      type: [String],
    },
    bio: {
      type: String,
      default: "This is default bio",
      maxLength: 1000,
    },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
      default:
        "https://www.google.com/imgres?q=default%20photo%20url&imgurl=https%3A%2F%2Fi.sstatic.net%2Fl60Hf.png&imgrefurl=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F49917726%2Fretrieving-default-image-all-url-profile-picture-from-facebook-graph-api&docid=eirPelkp9eoYkM&tbnid=JpaFCmffhUdABM&vet=12ahUKEwiEusfj0o2JAxWY4zgGHXVQAJMQM3oECBwQAA..i&w=1524&h=976&hcb=2&ved=2ahUKEwiEusfj0o2JAxWY4zgGHXVQAJMQM3oECBwQAA",
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$2910", {expiresIn: '1d'});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const hashedPassword = user?.password;
    const isValidPassword = await bcrypt.compare(passwordInputByUser, hashedPassword);
    return isValidPassword;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
