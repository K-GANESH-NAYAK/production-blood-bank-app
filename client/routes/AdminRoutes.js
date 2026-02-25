const express = require("express");
const authmiddleware = require("../middleware/authmiddleware");
const AdminMiddleware = require("../middleware/AdminMiddleware");

const {
  getHospitalListController,
  getOrganizationListController,
  deleteDonorController,
  updateDonorController,
  getDonorListController,
} = require("../controllers/adminControllers");

const router = express.Router();

// =====================================
// GET DONORS
// =====================================
router.get("/donors", authmiddleware, AdminMiddleware, getDonorListController);

// =====================================
// GET HOSPITALS
// =====================================
router.get("/hospital", authmiddleware, AdminMiddleware, getHospitalListController);

// =====================================
// GET ORGANIZATIONS
// =====================================
router.get("/organizations", authmiddleware, AdminMiddleware, getOrganizationListController);

// =====================================
// DELETE DONOR
// =====================================
router.delete(
  "/delete-donor/:id",
  authmiddleware,
  AdminMiddleware,
  deleteDonorController
);

// =====================================
// UPDATE DONOR
// =====================================
router.put(
  "/update-donor/:id",
  authmiddleware,
  AdminMiddleware,
  updateDonorController
);

module.exports = router;