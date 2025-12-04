import express from "express";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} from "../controllers/itemController.js";

import {protect , verifyAdminOrSuper } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET all items → any authenticated user
router.get("/", getItems);

// GET single item → any authenticated user
router.get("/:id", getItem);

// POST create item → admin or superadmin
router.post("/",protect , verifyAdminOrSuper, createItem);

// PUT update item → admin or superadmin
router.put("/:id",protect , verifyAdminOrSuper, updateItem);

// DELETE item → admin or superadmin
router.delete("/:id",protect , verifyAdminOrSuper, deleteItem);

export default router;
