// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const attendanceCtrl = require("../controller/attandanceCtrl");
const clearBody = require("../middleware/clreanBody")
const { verifyToken } = require("../middleware/verifikationCode");
const checkRole = require("../middleware/checkRoleMidelwer")
  
router.post("/",verifyToken, checkRole("teacher", "admin", "superadmin"), attendanceCtrl.createManyAttendance);
router.get("/", verifyToken, checkRole("teacher", "admin", "superadmin"), attendanceCtrl.getAttendance);
router.put("/:id", verifyToken, checkRole("teacher", "admin", "superadmin"), clearBody, attendanceCtrl.updateAttendance);
router.delete("/:id", verifyToken, checkRole("teacher", "admin", "superadmin"), attendanceCtrl.deleteAttendance);

module.exports = router;
