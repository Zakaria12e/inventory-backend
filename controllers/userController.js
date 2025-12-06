import User from "../models/User.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";

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


// GET user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE user profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.first_name = firstName || user.first_name;
    user.last_name = lastName || user.last_name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.bio = bio || user.bio;

    // Upload avatar to Cloudinary if file exists
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars", public_id: `user_${user._id}`, overwrite: true },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      user.profile_image = result.secure_url;
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
