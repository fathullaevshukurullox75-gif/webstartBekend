const Lesson = require("../model/lessonModel");

const lessonController = {
  createLesson: async (req, res) => {
    try {
      const { group, title, content, date } = req.body;

      if (!group || !title || !date) {
        return res
          .status(400)
          .json({ message: "Group, title va date majburiy maydonlar!" });
      }

      const lesson = await Lesson.create({ group, title, content, date });

      res.status(201).json({
        success: true,
        message: "Dars muvaffaqiyatli qo'shildi",
        data: lesson,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  },

  getLessons: async (req, res) => {
    try {
      const lessons = await Lesson.find()
        .populate("group", "name")
        .sort({ date: -1 });

      res.status(200).json({
        success: true,
        count: lessons.length,
        data: lessons,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  },

  getLessonById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Noto‘g‘ri ID format" });
      }

      const lesson = await Lesson.findById(id).populate("group", "name");

      if (!lesson) {
        return res.status(404).json({ message: "Dars topilmadi" });
      }

      res.status(200).json({
        success: true,
        data: lesson,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  },

  updateLesson: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Noto‘g‘ri ID format" });
      }

      const lesson = await Lesson.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!lesson) {
        return res.status(404).json({ message: "Dars topilmadi" });
      }

      res.status(200).json({
        success: true,
        message: "Dars yangilandi",
        data: lesson,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  },

  deleteLesson: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Noto‘g‘ri ID format" });
      }

      const lesson = await Lesson.findByIdAndDelete(id);

      if (!lesson) {
        return res.status(404).json({ message: "Dars topilmadi" });
      }

      res.status(200).json({
        success: true,
        message: "Dars o‘chirildi",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  },
};

module.exports = lessonController;
