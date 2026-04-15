const multer = require("multer");
const fs = require("fs");
const path = require("path");

const createUpload = (uploadSubDir = "profile") => {
  const uploadDir = path.join(__dirname, "uploads", uploadSubDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

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
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"), false);
      }
    },
  });

  return upload;
};

// Default export for backward compatibility
module.exports = createUpload();

// Named export for dynamic usage
module.exports.createUpload = createUpload;
