const adminAuth = (req, res, next) => {
  const token = req.headers?.token;
  console.log(req.body);
  if (token === "adminxyz") {
    next();
  } else {
    res.status(401).send("unautorized admin token !!!");
  }
};

const userAuth = (req, res , next)=>{
    const token = req.headers?.token;
    const authorized = token==="adminxyz";
    if(!authorized){
        res.status(401).send("User is not authorized !!!");
    } else{
        next();
    }
}

module.exports = { adminAuth, userAuth };
