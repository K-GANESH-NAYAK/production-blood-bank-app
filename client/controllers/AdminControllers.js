const userModel = require("../models/usermodel");

// ============================================
// GET DONOR LIST
// ============================================
const getDonorListController = async (req, res) => {
  try {
    const donors = await userModel
      .find({ role: "donor" })
      .select("-password");

    res.status(200).send({
      success: true,
      message: "Donor list fetched successfully",
      totalCount: donors.length,
      donors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Donor List API",
      error,
    });
  }
};

// ============================================
// GET HOSPITAL LIST
// ============================================
const getHospitalListController = async (req, res) => {
  try {
    const users = await userModel.find().select("role name email");

    console.log("All Roles in DB:");
    users.forEach(u => console.log(u.role));

    const hospitals = users.filter(
      (u) => u.role?.toLowerCase() === "hospital"
    );

    res.status(200).json({
      success: true,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ============================================
// GET ORGANIZATION LIST
// ============================================
const getOrganizationListController = async (req, res) => {
  try {
    const organizations = await userModel
      .find({ role: "organization" })
      .select("-password");

    res.status(200).send({
      success: true,
      message: "Organization list fetched successfully",
      totalCount: organizations.length,
      organizations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Organization List API",
      error,
    });
  }
};

// ============================================
// DELETE DONOR
// ============================================
const deleteDonorController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);

    res.status(200).send({
      success: true,
      message: "Donor record deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPDATE DONOR
// ============================================
const updateDonorController = async (req, res) => {
  try {
    const donor = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Donor record updated successfully",
      donor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDonorListController,
  getHospitalListController,
  getOrganizationListController,
  deleteDonorController,
  updateDonorController,
};