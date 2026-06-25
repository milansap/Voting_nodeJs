const mongoose = require("mongoose");

require("dotenv").config();

const mongoURL =
  process.env.MONGO_URI;

async function connectToMongoDB() {
  if (!mongoURL) {
    console.error("MONGO_URI is not set in the backend .env file");
    return;
  }

  try {
    await mongoose.connect(mongoURL, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

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
