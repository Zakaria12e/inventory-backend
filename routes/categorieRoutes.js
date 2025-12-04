import express from "express";

import {
  getCategories,
  createCategorie,
  updateCategorie,
  deleteCategorie
} from "../controllers/categorieController.js";

import {
  protect,
  verifyAdminOrSuper
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/",protect, verifyAdminOrSuper, createCategorie);
router.put("/:id",protect , verifyAdminOrSuper, updateCategorie);
router.delete("/:id",protect , verifyAdminOrSuper, deleteCategorie);

export default router;
