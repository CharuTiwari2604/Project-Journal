const jwt = require('jsonwebtoken');
const User = require('../model/authModel');

const authMiddleware = async (req, res, next) => {
  try {
    console.log("🔹 Auth middleware called for:", req.method, req.originalUrl);
    console.log("🔹 Cookies received:", req.cookies);

    const token = req.cookies.token;
    if (!token) {
      console.log("❌ No token found in cookies");
      return res.status(401).json({ message: 'Not Authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    console.log("✅ Authenticated user:", user._id.toString());
    next();

  } catch (error) {
    console.error("❌ Authentication error:", error.message);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
