import express from "express";
import {
  getAlerts,
  createAlert,
  markAlertSeen,
  clearAlerts
} from "../controllers/alertController.js";

import {protect , verifyAdminOrSuper } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET all alerts → any authenticated user
router.get("/", getAlerts);

// POST new alert → admin or superadmin
router.post("/",protect, verifyAdminOrSuper, createAlert);

// PATCH alert/:id/seen → mark an alert as seen
router.patch("/:id/seen",protect , verifyAdminOrSuper, markAlertSeen);

// DELETE /alerts/clear → clear all seen alerts → admin or superadmin
router.delete("/clear",protect , verifyAdminOrSuper, clearAlerts);

export default router;
