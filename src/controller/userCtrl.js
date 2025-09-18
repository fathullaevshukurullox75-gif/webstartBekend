const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userCtrl = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ role: "user" }).select("-password");
      res.status(200).json({
        message: "All Users",
        users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
  getOneUser: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ message: "User id is required" });
      }
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User found",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
  getTeachers: async (req, res) => {
    try {
      const teachers = await User.find({ role: "teacher" }).select("-password");

      if (!teachers || teachers.length === 0) {
        return res.status(404).json({ message: "No teachers found" });
      }

      res.status(200).json({
        message: "Teachers found",
        users: teachers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { username, surname, age, phonenumber, avatar, newImages } =
        req.body;

      if (username) user.username = username;
      if (surname) user.surname = surname;
      if (age) user.age = age;
      if (phonenumber) user.phonenumber = phonenumber;
      if (avatar) user.avatar = avatar;

      if (newImages && Array.isArray(newImages)) {
        const totalImages = user.images.length + newImages.length;
        if (totalImages > 5) {
          return res.status(400).json({
            message: "You can only upload up to 5 images.",
          });
        }
        user.images.push(...newImages);
      }

      await user.save();

      res.status(200).json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deletedUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User deleted successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userCtrl;
