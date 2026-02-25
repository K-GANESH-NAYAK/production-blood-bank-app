const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["admin", "organisation", "donor", "hospital"], // all lowercase
    },

    name: {
      type: String,
      required: function () {
        return this.role === "donor" || this.role === "admin";
      },
    },

    organizationName: {
      type: String,
      required: function () {
        return this.role === "organization";
      },
    },

    hospitalName: {
      type: String,
      required: function () {
        return this.role === "hospital";
      },
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role === "donor";
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    website: String,

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;