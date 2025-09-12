const express = require("express");
const router = express.Router();
const lessonController = require("../controller/lessonCtrl");

const { verifyToken } = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMidelwer")
const cleanBody = require("../middleware/clreanBody");

router.post(
  "/lessons",
  verifyToken,
  checkRole( "teacher","admin", "superadmin"),
  lessonController.createLesson
);

router.put(
  "/lessons/:id",
  verifyToken,
  checkRole( "teacher","admin", "superadmin"),
  cleanBody,
  lessonController.updateLesson
);

router.delete(
  "/lessons/:id",
  verifyToken,
  checkRole( "teacher","admin", "superadmin"),
  lessonController.deleteLesson
);

router.get("/lessons", lessonController.getLessons);
router.get("/lessons/:id", lessonController.getLessonById);

module.exports = router;
