const express = require("express");
const router = express.Router();
const User = require("../models/user");

const app = express();
app.use(express.json());

const { jwtAuthMiddleware, generateToken } = require("./../jwt");

//POST-add a new user

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    const newUser = new User(data);

    const response = await newUser.save();

    const payload = {
      userId: response.id,
    };

    res.status(200).json({
      message: "User created successfully",
      response: response,
    });
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { citizenship_no, password } = req.body;

    const user = await User.findOne({ citizenship_no: citizenship_no });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
    };

    const token = generateToken(payload);
    res.json({ token, message: "login successful", role: user.role });
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;

    const userId = userData.id;

    const user = await User.findById(userId);

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  console.log("Updating password for user:", req);
  try {
    const userId = req.user.id;

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user || !(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
