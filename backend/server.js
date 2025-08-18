const express = require("express");
const app = express();

const db = require("./db");

require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Server is running...");
});

//import the router files
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

//use the routes
app.use("/api/", userRoutes);
app.use("/api/candidates", candidateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
