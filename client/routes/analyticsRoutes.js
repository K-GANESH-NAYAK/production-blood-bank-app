const express = require("express");
const authmiddleware = require("../middleware/authmiddleware");
const { bloodGroupDetailcontroller } = require("../controllers/analyticsControllers");



const router = express.Router();



// GET BLOOD DATA
router.get("/bloodgroups-data", authmiddleware,bloodGroupDetailcontroller);



module.exports = router;
