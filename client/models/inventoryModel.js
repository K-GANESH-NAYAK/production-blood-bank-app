const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: true,
      enum: ["in", "out"],
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
    },

    quantity: {
      type: Number,
      required: true,
    },

    donarEmail: {  // ✅ CLEAN - NO **
      type: String,
      required: [true, "Donar Email is Required"],
    },

    // ✅ REQUIRED ONLY FOR OUT
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.inventoryType === "out";
      },
    },

    donar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.inventoryType === "in";
      },
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.inventoryType === "out";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
