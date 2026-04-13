const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { jwtAuthMiddleware, generateToken } = require("./../jwt");

// ✅ Create upload folder if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads/profile");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure multer with diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// POST - add a new user
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    const newUser = new User(data);
    const response = await newUser.save();

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

    const payload = { id: user.id };
    const token = generateToken(payload);

    res.json({ token, message: "login successful", role: user.role });
  } catch (err) {
    console.error("Error logging in", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching profile", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
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
    console.error("Error updating password", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, mobile_number, address, image, citizenship_no } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.image = image || user.image;
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile_number = mobile_number || user.mobile_number;
    user.address = address || user.address;
    user.citizenship_no = citizenship_no || user.citizenship_no;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT - Update profile picture
router.put(
  "/profile/picture/:id",
  jwtAuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const paramId = req.params.id;
      const authId = req.user.id;

      // 🔒 Check authorization
      if (paramId !== authId) {
        if (req.file) fs.unlinkSync(req.file.path); // cleanup uploaded file
        return res.status(403).json({
          message: "Unauthorized to update this profile",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Image file is required",
        });
      }

      const user = await User.findById(paramId);
      if (!user) {
        fs.unlinkSync(req.file.path); // cleanup uploaded file
        return res.status(404).json({
          message: "User not found",
        });
      }

      // 🧹 Delete old image from disk
      if (user.image) {
        const relativePath = user.image.replace(`${process.env.BASE_URL}/`, "");
        const oldPath = path.join(__dirname, "..", relativePath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // ✅ Save full URL to DB
      const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
      const imagePath = `${BASE_URL}/uploads/profile/${req.file.filename}`;
      user.image = imagePath;
      await user.save();

      res.status(200).json({
        message: "Profile picture updated successfully",
        user: {
          id: user._id,
          image: user.image,
        },
      });
    } catch (err) {
      // 🧹 Cleanup on unexpected error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error(err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size is too large. Maximum size allowed is 5MB",
      });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;