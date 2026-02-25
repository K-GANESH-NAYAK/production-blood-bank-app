const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  currentUserController,
} = require("../controllers/authControllers");

const authMiddleware = require("../middleware/authMiddleware");

// REGISTER
router.post("/register", registerController);

// LOGIN
router.post("/login", loginController);

// CURRENT USER
router.get("/current-user", authMiddleware, currentUserController);

module.exports = router;