// controllers/itemController.js

import Item from "../models/Item.js";
import Category from "../models/Categorie.js";
import Alert from "../models/Alert.js";
import Activity from "../models/Activity.js"; 
import { compare } from "bcrypt";

// ---------------------------
// Helper: Update category item count
// ---------------------------
const updateCategoryItemCount = async (categoryId) => {
  try {
    const count = await Item.countDocuments({ category: categoryId });
    await Category.findByIdAndUpdate(categoryId, { itemsCount: count });
  } catch (error) {
    console.error("Error updating category count:", error);
  }
};

// ---------------------------
// Helper: Smart Alert Creation
// ---------------------------
const handleAlert = async (item) => {
  try {
    const currentQty = item.quantity;
    const threshold = item.lowStockThreshold;

    const lastAlert = await Alert.findOne({ productId: item._id }).sort({ createdAt: -1 });

    if (currentQty > threshold) {
      if (lastAlert && lastAlert.isActive) {
        lastAlert.isActive = false;
        await lastAlert.save();
      }
      return;
    }

    const needNewAlert =
      !lastAlert ||
      !lastAlert.isActive ||
      (lastAlert.seen && lastAlert.quantityAtCreation !== currentQty);

    if (needNewAlert) {
      await Alert.create({
        productId: item._id,
        productName: item.name,
        message: `Low stock: only ${currentQty} ${item.unit} left`,
        isActive: true,
        seen: false,
        quantityAtCreation: currentQty
      });
      console.log(`ALERT CREATED: ${item.name} - ${currentQty} left`);
    }

  } catch (error) {
    console.error("Error handling alert:", error);
  }
};

// ---------------------------
// Helper: Log activity
// ---------------------------
const logActivity = async (user, action) => {
  if (!user || !user._id) {
    console.error("Cannot log activity: user is undefined or missing _id  " + user.first_name + " with id: " + user._id);
    return;
  }

  try {
    await Activity.create({
      user: user._id,       
      role: user.role,    
      action,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};


// ---------------------------
// Get all items
// ---------------------------
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("category", "name");
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// ---------------------------
// Get single item
// ---------------------------
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("category", "name");
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
};

// ---------------------------
// Create item
// ---------------------------
export const createItem = async (req, res) => {
  try {
    const { name, category, description, quantity, unit, lowStockThreshold } = req.body;

    const newItem = await Item.create({
      name,
      category,
      description,
      quantity: Number(quantity),
      unit,
      lowStockThreshold: Number(lowStockThreshold),
    });

    await updateCategoryItemCount(category);
    await handleAlert(newItem);

    if (req.user) {
      await logActivity(req.user, `Added new item "${newItem.name}" to inventory`);
    }

    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create item" });
  }
};

// ---------------------------
// Update item
// ---------------------------
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const oldCategory = item.category.toString();

    const { name, category, description, quantity, unit, lowStockThreshold } = req.body;

    item.name = name ?? item.name;
    item.category = category ?? item.category;
    item.description = description ?? item.description;
    item.quantity = quantity !== undefined ? Number(quantity) : item.quantity;
    item.unit = unit ?? item.unit;
    item.lowStockThreshold = lowStockThreshold !== undefined ? Number(lowStockThreshold) : item.lowStockThreshold;

    await item.save();

    if (oldCategory !== item.category.toString()) {
      await updateCategoryItemCount(oldCategory);
      await updateCategoryItemCount(item.category);
    } else {
      await updateCategoryItemCount(item.category);
    }

    await handleAlert(item);

    if (req.user) {
      await logActivity(req.user, `Updated item "${item.name}" in inventory`);
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
};

// ---------------------------
// Delete item
// ---------------------------
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const categoryId = item.category;
    await Item.deleteOne({ _id: item._id });

    await updateCategoryItemCount(categoryId);

    await Alert.create({
      productId: item._id,
      productName: item.name,
      message: `Item "${item.name}" removed from inventory`,
      isActive: true,
      seen: false,
      quantityAtCreation: item.quantity
    });

    if (req.user) {
      await logActivity(req.user, `Deleted item "${item.name}" from inventory`);
    }

    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
};
