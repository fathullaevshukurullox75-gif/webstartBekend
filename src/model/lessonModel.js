const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, default: "" }, 
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", LessonSchema);
