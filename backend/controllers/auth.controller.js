const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ success: false, message: "Email already in use" });

    if (await User.findOne({ username }))
      return res.status(409).json({ success: false, message: "Username already taken" });

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { signup, login, getMe };