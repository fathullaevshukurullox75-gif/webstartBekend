const Attendance = require("../model/attendanceModel");
const User = require("../model/userModel");
const Group = require("../model/groupModel");

const attendanceCtrl = {
  createAttendance: async (req, res) => {
    try {
      const { student, group, date, status } = req.body;

      if (!student || !group) {
        return res
          .status(400)
          .json({ message: "Student and Group are required" });
      }

      const studentExists = await User.findById(student);
      if (!studentExists)
        return res.status(404).json({ message: "Student not found" });

      const groupExists = await Group.findById(group);
      if (!groupExists)
        return res.status(404).json({ message: "Group not found" });

      let normalizedDate = new Date(date || Date.now());
      normalizedDate.setHours(0, 0, 0, 0);

      const existing = await Attendance.findOne({
        student,
        group,
        date: normalizedDate,
      });
      if (existing) {
        return res.status(400).json({
          message: "Attendance already exists for this student on this date",
        });
      }

      const attendance = await Attendance.create({
        student,
        group,
        date: normalizedDate,
        status,
      });

      res.status(201).json(attendance);
    } catch (error) {
      console.error("Create Attendance Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getAttendance: async (req, res) => {
    try {
      const { student, group, date } = req.query;
      let filter = {};

      if (student) filter.student = student;
      if (group) filter.group = group;
      if (date) {
        let normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        filter.date = normalizedDate;
      }

      const attendance = await Attendance.find(filter)
        .populate("student", "name email")
        .populate("group", "name");

      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["present", "absent", "late"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const attendance = await Attendance.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!attendance)
        return res.status(404).json({ message: "Attendance not found" });

      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      const { id } = req.params;

      const attendance = await Attendance.findByIdAndDelete(id);
      if (!attendance)
        return res.status(404).json({ message: "Attendance not found" });

      res.json({ message: "Attendance deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = attendanceCtrl;
