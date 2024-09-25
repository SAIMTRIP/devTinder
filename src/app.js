const express = require("express");

const app = express();

app.use('/',(req, res, next)=>{
    res.send("Hello from dashboard");
});

app.use('/test',(req, res, next)=>{
    res.send("server testing");
});

app.use('/hello',(req, res, next)=>{
    res.send("Hello from server");
});

app.listen("3000", ()=>{
    console.log("Server is listening on port 3000");       
});

