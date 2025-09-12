const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: null,
      min: 0,
      max: 120,
    },
    phonenumber: {
      type: String,
      default: "",
      match: [/^\+?[0-9]{9,15}$/, "Invalid phone number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    images: {
      type: [String], 
      validate: {
        validator: function (arr) {
          return arr.length <= 5; 
        },
        message: "You can upload up to 5 images only.",
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "teacher", "admin", "superadmin"],
    },
  },
  { timestamps: true, minimize: true }
);

module.exports = mongoose.model("User", UserSchema);
