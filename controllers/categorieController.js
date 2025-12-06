import Categorie from '../models/Categorie.js';
import { asyncHandler } from "../middlewares/asyncHandler.js";
import Activity from "../models/Activity.js";

// ---------------------------
// Helper: Log activity
// ---------------------------
const logActivity = async (user, action) => {
  try {
    await Activity.create({
      user: user._id,
      role: user.role,
      action,
      timestamp: new Date()
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

// ---------------------------
// GET all categories
// ---------------------------
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Categorie.find();
  res.status(200).json(categories);
});

// ---------------------------
// CREATE category
// ---------------------------
export const createCategorie = asyncHandler(async (req, res) => {
  const { name, description, icon, iconColor } = req.body;

  if (!name || !icon) {
    return res.status(400).json({ message: "Name and icon are required" });
  }

  const categorie = await Categorie.create({
    name,
    description,
    icon,
    iconColor,
  });

  if (req.user) {
    await logActivity(req.user, `Added new category "${name}"`);
  }

  res.status(201).json(categorie);
});

// ---------------------------
// UPDATE category
// ---------------------------
export const updateCategorie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, icon, iconColor } = req.body;

  const categorie = await Categorie.findByIdAndUpdate(
    id,
    { name, description, icon, iconColor },
    { new: true, runValidators: true }
  );

  if (!categorie) {
    return res.status(404).json({ message: 'Categorie not found' });
  }

  if (req.user) {
    await logActivity(req.user, `Updated category "${categorie.name}"`);
  }

  res.status(200).json(categorie);
});

// ---------------------------
// DELETE category
// ---------------------------
export const deleteCategorie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const categorie = await Categorie.findByIdAndDelete(id);

  if (!categorie) {
    return res.status(404).json({ message: 'Categorie not found' });
  }

  if (req.user) {
    await logActivity(req.user, `Deleted category "${categorie.name}"`);
  }

  res.status(200).json({ message: 'Categorie deleted successfully' });
}); 