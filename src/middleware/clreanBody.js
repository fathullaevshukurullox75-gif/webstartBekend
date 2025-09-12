const cleanBody = (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return next();
    }

    const cleaned = {};

    for (let key in req.body) {
      const value = req.body[key];

      if (value !== null && value !== undefined && value !== "") {
        cleaned[key] = value;
      }
    }

    req.body = cleaned;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Body tozalashda xatolik",
      error: error.message,
    });
  }
};

module.exports = cleanBody;
