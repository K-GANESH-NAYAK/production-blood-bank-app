const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ SUPPORT ALL COMMON TOKEN SHAPES
    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure",
      });
    }

    req.user = {
      userId,
      role: decoded.role || null,
      organization: decoded.organization || null,
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token expired, please login again"
          : "Invalid token",
    });
  }
};

module.exports = authmiddleware;
