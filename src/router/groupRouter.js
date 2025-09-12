const express = require("express");
const router = express.Router();
const GroupCtrl = require("../controller/groupCtrl");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/group", authMiddleware, GroupCtrl.createGroup);
router.get("/group", authMiddleware, GroupCtrl.getGroups);
router.get("/group/:id", authMiddleware, GroupCtrl.getGroupById);
router.put("/group/:id", authMiddleware, GroupCtrl.updateGroup);
router.delete("/group/:id", authMiddleware, GroupCtrl.deleteGroup);

module.exports = router;
