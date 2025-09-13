const Homework = require("../model/homeworkModel");
const Lesson = require("../model/lessonModel");
// const User = require("../models/User");
const HomeworkCtrl = {
  createHomework: async (req, res) => {
    try {
      const { lesson, content } = req.body;

      if (!lesson || !content) {
        return res
          .status(400)
          .json({ message: "Lesson and content are required" });
      }

      const lessonExists = await Lesson.findById(lesson);
      if (!lessonExists) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      if (req.user.role === "student") {
        return res
          .status(403)
          .json({ message: "Only students can submit homework" });
      }

      const homework = await Homework.create({
        student: req.user.id,
        lesson,
        content,
      });

      res.status(201).json(homework);
    } catch (error) {
      console.error("Create Homework Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getHomeworks: async (req, res) => {
    try {
      if (!["teacher", "admin", "superadmin"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const homeworks = await Homework.find()
        .populate("student", "name email")
        .populate("lesson", "title");

      res.json(homeworks);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  gradeHomework: async (req, res) => {
    try {
      const { id } = req.params;
      const { grade } = req.body;

      if (typeof grade !== "number" || grade < 0 || grade > 100) {
        return res
          .status(400)
          .json({ message: "Grade must be a number between 0 and 100" });
      }

      if (!["teacher", "admin", "superadmin"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const homework = await Homework.findByIdAndUpdate(
        id,
        { grade },
        { new: true }
      );

      if (!homework) {
        return res.status(404).json({ message: "Homework not found" });
      }

      res.json(homework);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteHomework: async (req, res) => {
    try {
      const { id } = req.params;

      if (!["teacher", "admin", "superadmin"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const homework = await Homework.findByIdAndDelete(id);
      if (!homework) {
        return res.status(404).json({ message: "Homework not found" });
      }

      res.json({ message: "Homework deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};
module.exports = HomeworkCtrl;
