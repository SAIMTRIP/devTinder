const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://someshtripathi007st:ryBjrexE6DxOjB2T@namastenode.ojdjr.mongodb.net/devTinder"
  );
};


module.exports = { connectDB };
