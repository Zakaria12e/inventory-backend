// controllers/authController.js
import User from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// Register
export const register = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

  const user = await User.create({ first_name, last_name, email, password, role });
  sendToken(user, 201, res);
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

  sendToken(user, 200, res);
});

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json({ success: true, data: user });
});
