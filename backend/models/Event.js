const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "completed"],
      default: "active",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    attendees: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["present", "absent"],
          default: "absent",
        },
        registrationStatus: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
