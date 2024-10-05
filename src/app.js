const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post('/signup', async (req, res, next)=>{
    // Creating a new instance of User model
    console.log(req.body);
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User created successfully");
    }catch{
        res.status(400).send("Error creating User:"+ err.message);
    }
    
  })

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

  
