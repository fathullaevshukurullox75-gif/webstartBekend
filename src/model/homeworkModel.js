const mongoose = require("mongoose");

const HomeworkSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    content: { type: String, required: true }, // talaba yuborgan vazifa
    grade: { type: Number, default: null }, // o‘qituvchi qo‘ygan baho
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homework", HomeworkSchema);
