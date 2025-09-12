const express = require("express");
const router = express.Router();
const CourseCtrl = require("../controller/courseCtrl");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", CourseCtrl.getCourses);
router.get("/:id", CourseCtrl.getCourseById);

router.post("/", authMiddleware, CourseCtrl.createCourse);
router.put("/:id", authMiddleware, CourseCtrl.updateCourse);
router.delete("/:id", authMiddleware, CourseCtrl.deleteCourse);

module.exports = router;
