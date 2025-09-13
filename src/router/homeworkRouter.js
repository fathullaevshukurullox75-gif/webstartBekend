// routes/homeworkRoutes.js
const express = require("express");
const router = express.Router();
const homeworkCtrl = require("../controller/homeworkCtrl");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, homeworkCtrl.createHomework);
router.get("/", verifyToken, homeworkCtrl.getHomeworks);
router.put("/:id/grade", verifyToken, homeworkCtrl.gradeHomework);
router.delete("/:id", verifyToken, homeworkCtrl.deleteHomework);

module.exports = router;
