const express = require("express");

const app = express();

const {adminAuth, userAuth} = require('./middlewares/auth');

app.use('/admin', adminAuth);

app.post("/user/login", (req, res, next)=>{
    res.send("user logged in successfully");
})

app.get("/user/getData", userAuth, (req, res, next)=>{
    // res.send("All user data sent");
    throw new Error("test error");
})

app.get("/admin/getAllData", adminAuth, (req, res, next)=>{
    res.send('Admin all data sent')
})

app.use('/', (err, req, res, next)=>{
    if(err){
        res.status(500).send("something went wrong");
    }
})

// app.get("/", (req, res, next) => {
//   res.send("Hello from dashboard");
// });

// // app.get('/te(st)+1',(req, res, next)=>{
// //     res.send("server testing");
// // });

// app.get(/.*test$/, (req, res, next) => {
//   console.log();
//   res.send({ firstName: "somesh", lastName: "tripathi" });
// });


// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("Handling route user ");
//     next();
//     // res.send("Response 1")
//     next();
//   },
//   [
//     (req, res, next) => {
//       console.log("Response 2");
//       next();
//     },
//     (req, res, next) => {
//       console.log("Response 3");
//       res.send("Response 3");
//     },
//   ]
// );

// app.post("/hello/:userId/:userName/:password", (req, res, next) => {
//   console.log(req.params);
//   res.send("Hello from server");
// });

app.listen("3000", () => {
  console.log("Server is listening on port 3000");
});
