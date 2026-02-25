const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usermodel = require("../models/userModel");

// REGISTER
const registerController = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new usermodel({
      ...req.body,
      role: role ? role.toLowerCase() : "user", // default role 'user'
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
    });
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
    });
  }
};

// CURRENT USER
const currentUserController = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await usermodel.findById(req.user.userId).select("-password");

    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("CURRENT USER ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Unable to get current user",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  currentUserController,
};