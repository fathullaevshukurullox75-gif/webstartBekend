const Course = require("../model/courseModel");

const CourseCtrl = {
  createCourse: async (req, res) => {
    try {
      if (!req.user || !["admin", "superAdmin"].includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      let {
        title,
        description = "",
        price,
        duration,
        level = "beginner",
      } = req.body;

      if (!title || !price || !duration) {
        return res
          .status(400)
          .json({ message: "Title, price and duration are required" });
      }

      if (await Course.findOne({ title })) {
        return res
          .status(400)
          .json({ message: "Course with this title already exists" });
      }

      if (price <= 0) {
        return res
          .status(400)
          .json({ message: "Price must be a positive number" });
      }

      if (!["beginner", "intermediate", "advanced"].includes(level)) {
        return res.status(400).json({ message: "Invalid level" });
      }

      const course = await Course.create({
        title,
        description,
        price,
        duration,
        level,
      });

      res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
      console.error("Create Course Error:", error);
      res.status(500).json({ message: error.message });
    }
  },
  getCourses: async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCourse: async (req, res) => {
    try {
      if (!req.user || !["admin", "superAdmin"].includes(req.user.role)) {
        return res.status(403).json({
          message:
            "Access denied. Only admin or super admin can update courses.",
        });
      }

      const { title, description, price, duration, level } = req.body;

      if (title && title.trim().length === 0) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }

      if (title) {
        const existingCourse = await Course.findOne({
          title,
          _id: { $ne: req.params.id },
        });
        if (existingCourse) {
          return res
            .status(400)
            .json({ message: "Course with this title already exists" });
        }
      }

      if (price !== undefined) {
        if (price <= 0) {
          return res
            .status(400)
            .json({ message: "Price must be a positive number" });
        }
      }

      if (duration !== undefined && duration.trim().length === 0) {
        return res.status(400).json({ message: "Duration cannot be empty" });
      }

      if (level !== undefined) {
        const allowedLevels = ["beginner", "intermediate", "advanced"];
        if (!allowedLevels.includes(level)) {
          return res.status(400).json({
            message: "Invalid level. Allowed: beginner, intermediate, advanced",
          });
        }
      }

      const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({
        message: "Course updated successfully",
        course,
      });
    } catch (error) {
      console.error("Update Course Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      if (!req.user || !["admin", "superAdmin"].includes(req.user.role)) {
        return res.status(403).json({
          message:
            "Access denied. Only admin or super admin can delete courses.",
        });
      }

      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      await course.deleteOne();

      res.status(200).json({
        message: "Course deleted successfully",
        course,
      });
    } catch (error) {
      console.error("Delete Course Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = CourseCtrl;
