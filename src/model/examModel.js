const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    maxScore: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
