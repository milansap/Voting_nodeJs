const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");
const path = require("path");
require("dotenv").config();

app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 3001;
app.get("/", (req, res) => {
  res.send("Server is running...");
});

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
app.use("/api/", userRoutes);
app.use("/api/candidates", candidateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});