const express = require("express");
const router=express.Router()
const user=require("../controller/userCtrl")

router.get("/users",user.getAllUsers)
router.get("/users/:id",user.getOneUser)
router.delete("/users/:id",user.deletedUser)

module.exports=router 