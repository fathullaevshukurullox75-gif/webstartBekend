const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/userCtrl");

router.get("/users", userCtrl.getAllUsers);
router.get("/users/top", userCtrl.getTeachers);
router.get("/users/:id", userCtrl.getOneUser);
router.put("/users/:id", userCtrl.updateUser);
router.delete("/users/:id", userCtrl.deletedUser);

module.exports = router;
