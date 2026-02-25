const express = require('express');
const router = express.Router();

// Import the controller
const testController = (req, res) => {
  res.status(200).send({
    message: "Test route working",
    success: true
  });
};

// Define route
router.get('/', testController);

module.exports = router;
