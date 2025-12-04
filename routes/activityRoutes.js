import express from "express";
import { getActivities, addActivity } from "../controllers/activityController.js";
import {protect , verifyAdminOrSuper } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET all activities → any authenticated user
router.get("/",protect, verifyAdminOrSuper, getActivities);

// POST new activity → admin or superadmin
router.post("/",protect, verifyAdminOrSuper, addActivity);

export default router;
