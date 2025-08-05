const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: "token not found" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid tokens" });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, jwtSecret, { expiresIn: 30000 });
};

module.exports = { jwtAuthMiddleware, generateToken };
