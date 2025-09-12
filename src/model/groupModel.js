const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    schedule: [{
      day: String,
      time: String
    }],
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active"
    },
    startDate: Date,
    endDate: Date,
    capacity: {
      type: Number,
      default: 20
    },
    description: {
      type: String,
      default: ""
    }
  },
  { timestamps: true, minimize: true }
);

module.exports = mongoose.model("Group", GroupSchema);
