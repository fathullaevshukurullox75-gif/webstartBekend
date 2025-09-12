const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authCtrl = {
  signup: async (req, res) => {
    try {
      const { username, surname, email, password, phonenumber, age, role } = req.body;

      if (!username || !surname || !email || !password) {
        return res.status(400).json({ message: "Please fill all required fields" });
      }

      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res.status(400).json({ message: "This email already exists!" });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        surname,
        email,
        password: hashPassword,
        phonenumber: phonenumber || "",
        age: age || null,
        role: role || 100, 
      });

      await newUser.save();

      const { password: pw, ...userData } = newUser._doc;

      const token = JWT.sign(userData, JWT_SECRET_KEY, { expiresIn: "48h" });

      res.status(201).json({
        message: "Signup successful",
        user: userData,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const { password: pw, ...userData } = user._doc;

      const token = JWT.sign(userData, JWT_SECRET_KEY, { expiresIn: "48h" });

      res.status(200).json({
        message: "Login successful",
        user: userData,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authCtrl;
