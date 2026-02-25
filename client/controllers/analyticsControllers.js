const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");

const bloodGroupDetailcontroller = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodGroupData = [];

    // ✅ CORRECT ID
    const organization = new mongoose.Types.ObjectId(req.user.userId);

    for (let group of bloodGroups) {
      const totalIn = await Inventory.aggregate([
        {
          $match: {
            organization: organization,
            bloodGroup: group,
            inventoryType: "in",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalOut = await Inventory.aggregate([
        {
          $match: {
            organization: organization,
            bloodGroup: group,
            inventoryType: "out",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$quantity" },
          },
        },
      ]);

      bloodGroupData.push({
        bloodGroup: group,
        totalIn: totalIn[0]?.total || 0,
        totalOut: totalOut[0]?.total || 0,
        availableBlood:
          (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0),
      });
    }

    return res.status(200).send({
      success: true,
      bloodGroupData,
      message:"Blood Groups Data Fetch Successfully"
      
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { bloodGroupDetailcontroller };
