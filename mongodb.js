const mongoose = require("mongoose");

const db = () => {
  const uri = process.env.MONGODB_URI;
  mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Database created successfully")
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected successfully")
  });

  mongoose.connection.on("error", (err) => {
    console.log("Database connection error")
  });
  
  
};

module.exports = db;