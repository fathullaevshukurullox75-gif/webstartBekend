const express = require("express");
const router = express.Router();
const GroupCtrl = require("../controller/groupCtrl");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, GroupCtrl.createGroup);
router.get("/", authMiddleware, GroupCtrl.getGroups);
router.get("/:id", authMiddleware, GroupCtrl.getGroupById);
router.put("/:id", authMiddleware, GroupCtrl.updateGroup);
router.delete("/:id", authMiddleware, GroupCtrl.deleteGroup);

module.exports = router;
