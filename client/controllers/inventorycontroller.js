const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createinventoryController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { inventoryType, bloodGroup, quantity, donarEmail } = req.body;

    if (!inventoryType || !bloodGroup || !quantity || !donarEmail) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const inventoryData = {
      inventoryType,
      bloodGroup,
      quantity: Number(quantity),
      donarEmail,
      organization: userId,
    };

    if (inventoryType === "in") {
      inventoryData.donar = userId;
    }
    
    if (inventoryType === "out") {
      inventoryData.hospital = userId;
      
      const totalIn = await inventoryModel.aggregate([
        { $match: { organization: new mongoose.Types.ObjectId(userId), bloodGroup, inventoryType: "in" } },
        { $group: { _id: null, totalIn: { $sum: "$quantity" } } }
      ]);

      const totalOut = await inventoryModel.aggregate([
        { $match: { organization: new mongoose.Types.ObjectId(userId), bloodGroup, inventoryType: "out" } },
        { $group: { _id: null, totalOut: { $sum: "$quantity" } } }
      ]);

      const available = Math.max(0, (totalIn[0]?.totalIn || 0) - (totalOut[0]?.totalOut || 0));
      
      if (Number(quantity) > available) {
        return res.status(400).json({
         success: false,
         message: `Only ${available}ml ${bloodGroup} available`
        });
      }
    }

    const inventory = await inventoryModel.create(inventoryData);
    return res.status(201).json({ success: true, inventory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Organization - only user's own inventory
const getinventoryController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inventory = await inventoryModel
      .find({ organization: new mongoose.Types.ObjectId(userId) })
      .populate({
        path: 'donar',
        select: 'name email phone hospitalName organisationName'
      })
      .populate({
        path: 'hospital', 
        select: 'name email phone hospitalName organisationName'
      })
      .populate({
        path: 'organization',
        select: 'name email phone hospitalName organisationName'
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, inventory });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching inventory" });
  }
};

// ✅ Hospital blood records - only hospital's requests
const getinventoryHospitalController = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const inventory = await inventoryModel
      .find({ 
        hospital: new mongoose.Types.ObjectId(userId),
        inventoryType: "out"
      })
      .populate({
        path: 'donar',
        select: 'name email phone hospitalName organisationName'
      })
      .populate({
        path: 'hospital', 
        select: 'name email phone hospitalName organisationName'
      })
      .populate({
        path: 'organization',
        select: 'name email phone address hospitalName organisationName'
      })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, inventory });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error in get consumer inventory" });
  }
};

//GET RECENT BLOOD RECORDS

const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel.find({
      organization: req.user.userId, // safer than req.body.userId
    })
    .limit(3)
    .sort({ createdAt: -1 })
    .populate({
      path: 'hospital',
      select: 'hospitalName email'
    })
    .populate({
      path: 'organization',
      select: 'name email'
    });

    return res.status(200).json({
      success: true,
      message: "Recent inventory data",
      inventory
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching recent inventory"
    });
  }
};


const getDonarsController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const donars = await inventoryModel
      .find({ 
        organization: new mongoose.Types.ObjectId(userId),
        inventoryType: "in"
      })
      .populate({
        path: 'donar',
        select: 'name email phone hospitalName organisationName'
      })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, inventory: donars });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching donars" });
  }
};

const getHospitalsController = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const hospitals = await inventoryModel
      .find({ 
        organization: new mongoose.Types.ObjectId(userId),
        inventoryType: "out"
      })
      .populate({
        path: 'hospital',
        select: 'name email phone address hospitalName organisationName'
      })
      .populate({
        path: 'organization',
        select: 'name email phone address hospitalName organisationName'
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, inventory: hospitals });
  } catch (error) {
    console.error("GET HOSPITALS ERROR:", error);
    return res.status(500).json({ success: false, message: "Error fetching hospitals" });
  }
};

const getOrganizationController = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const donarId = req.user.userId;
    const userDonations = await inventoryModel.find({ 
      donar: donarId,
      inventoryType: "in"
    }).select('organization');
    
    const orgIds = [...new Set(userDonations.map(record => record.organization.toString()))];
    
    const organizations = await userModel.find({ 
      _id: { $in: orgIds } 
    }).select('name email phone address hospitalName organisationName');
    
    return res.status(200).json({ success: true, organizations });
  } catch (error) {
    console.error("getOrganizationController ERROR:", error);
    return res.status(500).json({ success: false, message: 'error in ORG api' });
  }
};

const getOrganizationForHospitalController = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const hospitalId = req.user.userId;
    const hospitalRequests = await inventoryModel.find({ 
      hospital: hospitalId,
      inventoryType: "out"
    }).select('organization');
    
    const orgIds = [...new Set(hospitalRequests.map(record => record.organization.toString()))];
    
    const organizations = await userModel.find({ 
      _id: { $in: orgIds } 
    }).select('name email phone address hospitalName organisationName');
    
    return res.status(200).json({ success: true, organizations });
  } catch (error) {
    console.error("getOrganizationForHospitalController ERROR:", error);
    return res.status(500).json({ success: false, message: 'error in Hospital ORG api' });
  }
};

module.exports = {
  createinventoryController,
  getinventoryController,
  getinventoryHospitalController,  
  getDonarsController,
  getHospitalsController,
  getOrganizationController,
  getOrganizationForHospitalController,
  getRecentInventoryController
};
