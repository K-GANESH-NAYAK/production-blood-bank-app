const User = require("../models/usermodel");

module.exports = async (req, res, next) => {
  try {
    // ✅ FIXED — match JWT payload
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Auth Failed, ADMIN API",
    });
  }
};