import User from "../models/User.js";
import bcrypt from "bcrypt";

// ---------------------------
// Get all users
// ---------------------------
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ---------------------------
// Create user (superadmin only)
// ---------------------------
export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      role,
    });

    const safeUser = await User.findById(user._id).select("-password");
    res.status(201).json(safeUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// ---------------------------
// Delete user (superadmin only)
// ---------------------------
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
