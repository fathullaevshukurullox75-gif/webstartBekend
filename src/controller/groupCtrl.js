const Group = require("../model/groupModel");
const User = require("../model/userModel");
const Course = require("../model/courseModel");

const GroupCtrl = {
  createGroup: async (req, res) => {
    try {
      if (!req.user || !["admin", "superAdmin"].includes(req.user.role)) {
        return res.status(403).json({
          message:
            "Access denied. Only admin or super admin can create groups.",
        });
      }

      let {
        groupName,
        students = [],
        teacher,
        course,
        schedule = [],
        status = "active",
        startDate,
        endDate,
        capacity = 20,
        description = "",
      } = req.body;

      if (!groupName || !teacher || !course) {
        return res
          .status(400)
          .json({ message: "Group name, teacher and course are required" });
      }

      const [teacherExists, courseExists] = await Promise.all([
        User.findById(teacher),
        Course.findById(course),
      ]);
      if (!teacherExists)
        return res.status(404).json({ message: "Teacher not found" });
      if (!courseExists)
        return res.status(404).json({ message: "Course not found" });

      let validStudents = [];
      if (students.length) {
        const foundStudents = await User.find({ _id: { $in: students } });

        if (foundStudents.length !== students.length) {
          return res.status(400).json({ message: "Some students not found" });
        }
        validStudents = foundStudents.map((s) => s._id);
      }

      if (validStudents.length > capacity) {
        return res.status(400).json({ message: "Capacity exceeded" });
      }

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res
          .status(400)
          .json({ message: "Start date cannot be later than end date" });
      }

      for (let s of schedule) {
        if (!s.day || !s.time) {
          return res
            .status(400)
            .json({ message: "Schedule day and time required" });
        }
      }

      const newGroup = await Group.create({
        groupName,
        students: validStudents,
        teacher,
        course,
        schedule,
        status,
        startDate,
        endDate,
        capacity,
        description,
      });
      res.status(201).json({
        message: "Group created successfully",
        group: newGroup,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  getGroups: async (req, res) => {
    try {
      const groups = await Group.find()
        .populate("students", "username surname email")
        .populate("teacher", "username surname email")
        .populate("course", "title duration");
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getGroupById: async (req, res) => {
    try {
      const group = await Group.findById(req.params.id)
        .populate("students", "username surname email")
        .populate("teacher", "username surname email")
        .populate("course", "title duration");

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateGroup: async (req, res) => {
    try {
      const {
        groupName,
        students,
        teacher,
        course,
        schedule,
        status,
        startDate,
        endDate,
        capacity,
        description,
      } = req.body;

      if (!req.user || !["admin", "superAdmin"].includes(req.user.role)) {
        return res.status(403).json({
          message:
            "Access denied. Only admin or super admin can update groups.",
        });
      }

      const group = await Group.findById(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      if (teacher) {
        const teacherExists = await User.findById(teacher);
        if (!teacherExists) {
          return res.status(404).json({ message: "Teacher not found" });
        }
        group.teacher = teacher;
      }

      if (course) {
        const courseExists = await Course.findById(course);
        if (!courseExists) {
          return res.status(404).json({ message: "Course not found" });
        }
        group.course = course;
      }

      if (students) {
        const foundStudents = await User.find({ _id: { $in: students } });
        if (foundStudents.length !== students.length) {
          return res.status(400).json({ message: "Some students not found" });
        }
        group.students = foundStudents.map((s) => s._id);
      }

      if (capacity) {
        if (group.students.length > capacity) {
          return res.status(400).json({ message: "Capacity exceeded" });
        }
        group.capacity = capacity;
      }

      if (startDate) group.startDate = startDate;
      if (endDate) group.endDate = endDate;
      if (
        group.startDate &&
        group.endDate &&
        new Date(group.startDate) > new Date(group.endDate)
      ) {
        return res
          .status(400)
          .json({ message: "Start date cannot be later than end date" });
      }

      if (schedule) {
        for (let s of schedule) {
          if (!s.day || !s.time) {
            return res
              .status(400)
              .json({ message: "Schedule day and time required" });
          }
        }
        group.schedule = schedule;
      }

      if (groupName) group.groupName = groupName;
      if (status) group.status = status;
      if (description) group.description = description;

      await group.save();

      res.status(200).json({
        message: "Group updated successfully",
        group,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteGroup: async (req, res) => {
    try {
      if (!req.user || !["admin", "superAdmin"].includes(req.user.role)) {
        return res.status(403).json({
          message:
            "Access denied. Only admin or super admin can delete groups.",
        });
      }

      const group = await Group.findById(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      await group.deleteOne();

      res.status(200).json({
        message: "Group deleted successfully",
        group,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = GroupCtrl;
