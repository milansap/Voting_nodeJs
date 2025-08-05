const mongoose = require("mongoose");

require("dotenv").config();

const mongoURL =
  process.env.MONGO_URI;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});
db.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});
db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

module.exports = db;
