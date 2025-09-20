const Attendance = require("../model/attendanceModel");
const User = require("../model/userModel");
const Group = require("../model/groupModel");

const attendanceCtrl = {
  createManyAttendance: async (req, res) => {
    try {
      const { group, records, date } = req.body;

      if (!group || !records || !Array.isArray(records)) {
        return res.status(400).json({ message: "Group va records talab qilinadi" });
      }

      const groupExists = await Group.findById(group);
      if (!groupExists) {
        return res.status(404).json({ message: "Group topilmadi" });
      }

      let normalizedDate = new Date(date || Date.now());
      normalizedDate.setHours(0, 0, 0, 0);

      const toInsert = records.map((r) => ({
        student: r.student,
        group,
        date: normalizedDate,
        status: r.status || "absent",
      }));

      // upsert (agar mavjud bo‘lsa update qiladi, bo‘lmasa qo‘shadi)
      const results = await Promise.all(
        toInsert.map(async (record) => {
          return await Attendance.findOneAndUpdate(
            {
              student: record.student,
              group: record.group,
              date: record.date,
            },
            record,
            { upsert: true, new: true }
          );
        })
      );

      res.status(201).json({ message: "✅ Davomat saqlandi", data: results });
    } catch (error) {
      console.error("Create Many Attendance Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get attendance
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
        .populate("student", "username email")
        .populate("group", "groupName");

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
