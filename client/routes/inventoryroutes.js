const express = require("express");
const authmiddleware = require("../middleware/authmiddleware");
const {
  createinventoryController,
  getinventoryController,
  getDonarsController,
  getHospitalsController,
  getOrganizationController,
  getOrganizationForHospitalController,
  getinventoryHospitalController,
  getRecentInventoryController,
} = require("../controllers/inventorycontroller");

const router = express.Router();

// ADD INVENTORY
router.post("/create-inventory", authmiddleware, createinventoryController);

// GET ALL BLOOD RECORDS
router.get("/get-inventory", authmiddleware, getinventoryController);

// GET RECENT BLOOD RECORDS
router.get("/get-recent-inventory", authmiddleware, getRecentInventoryController);

// GET HOSPITAL BLOOD RECORDS
router.get("/get-inventory-hospital", authmiddleware, getinventoryHospitalController);

// GET DONORS
router.get("/get-donars", authmiddleware, getDonarsController);

// ✅ FIXED: match frontend
router.get("/get-hospitals", authmiddleware, getHospitalsController);

// GET ORGANIZATION RECORDS
router.get("/get-organizations", authmiddleware, getOrganizationController);
router.get("/get-organizations-for-hospital", authmiddleware, getOrganizationForHospitalController);

module.exports = router;
